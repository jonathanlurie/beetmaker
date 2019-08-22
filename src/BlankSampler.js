import Sample from './Sample'

class BlankSampler {

  constructor(track, audioContext, options={}){
    this._blankDurationSec = 'blankDurationSec' in options ? options.blankDurationSec : 0.2
    this._sampleDurationSec = 'sampleDurationSec' in options ? options.sampleDurationSec : 0.5
    this._pcmThreshold = 'pcmThreshold' in options ? options.pcmThreshold : 0.02
    this._track = track
    this._audioContext = audioContext
    this._nonBlankSequences = null
  }


  analyse(){
    let abs = Math.abs
    let channels = []
    for(let i=0; i<this._track.getNumberOfChannels(); i++){
      channels.push(this._track.getPcmData(i))
    }

    if(this._pcmThreshold === 'auto'){
      // find pcm min max and avg (in abs value) to make a smart pcmThreshold
      let min = Infinity
      let max = -Infinity
      let avg = 0
      for(let i=0; i<channels[0].length; i++){
        // all channel at this sample are bellow the threshold
        let allBellowThres = true
        for(let j=0; j<channels.length; j++){
          let pcmVal = abs(channels[j][i])
          min = Math.min(min, pcmVal)
          max = Math.min(max, pcmVal)
          avg += pcmVal
        }
      }
      avg /= (channels.length * channels[0].length)
      this._pcmThreshold = min + (avg - min) * 0.6
    }



    let blankDuration = ~~(this._blankDurationSec * this._track.getSampleRate())
    let sampleDuration = ~~(this._sampleDurationSec * this._track.getSampleRate())

    let blankSequences = []
    let soundingSequences = []
    let isBlank = true
    let blankStart = 0

    for(let i=0; i<channels[0].length; i++){

      // all channel at this sample are bellow the threshold
      let allBellowThres = true
      for(let j=0; j<channels.length; j++){
        if(abs(channels[j][i]) > this._pcmThreshold){
          allBellowThres = false
          break
        }
      }

      // a blank is starting
      if(!isBlank && allBellowThres){
        isBlank = true
        blankStart = i
      } else
      // a blank is ending
      if(isBlank && !allBellowThres){
        isBlank = false
        blankSequences.push([blankStart, i])
        blankStart = 0
      }
    }

    // close a blank that may have started and lasted until the end of the track
    if(isBlank){
      blankSequences.push([blankStart, channels[0].length-1])
    }

    // filter out the blanks that are too short
    blankSequences = blankSequences.filter(seq => {
      return (seq[1] - seq[0]) > blankDuration
    })

    if(blankSequences.length === 0){
      console.log('There is no blank in this track')
      return
    }

    // make a negative of the blanks to get the sounding parts
    let flat = [0]
    for(let i=0; i<blankSequences.length; i++){
      flat.push(blankSequences[i][0], blankSequences[i][1])
    }

    for(let i=0; i<flat.length-2; i+=2){
      soundingSequences.push([flat[i], flat[i+1]])
    }

    // filter out all the sound sequences that are too short
    soundingSequences = soundingSequences.filter(seq => {
      return (seq[1] - seq[0]) > sampleDuration
    })

    this._nonBlankSequences = soundingSequences
  }


  createSamples(){
    if(this._nonBlankSequences === null){
      return null
    }

    let sampleRate = this._track.getSampleRate()
    let samples = []

    for(let i=0; i<this._nonBlankSequences.length; i++){
      let secStart = this._nonBlankSequences[i][0] / sampleRate
      let secDuration = (this._nonBlankSequences[i][1] - this._nonBlankSequences[i][0]) / sampleRate
      let s = new Sample(this._track, this._audioContext, {
        offsetSecond: secStart,
        durationSeconds: secDuration,
        name: `${this._track.getName()} [${(~~(secStart*100))/100} -> ${(~~((secStart+secDuration)*100))/100}]`
      })
      samples.push(s)
    }

    return samples
  }

}

export default BlankSampler
