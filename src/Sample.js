import getSupervillain from './Supervillains'

/**
 * A Sample is a subset of a track, potentially with some filters applied to it
 */
class Sample {

  constructor(track, audioContext, options={}){
    this._track = track
    this._audioContext = audioContext
    this._offsetSeconds = 'offsetSecond' in options ? options.offsetSecond : 0
    this._durationSeconds = 'durationSeconds' in options ? options.durationSeconds : null
    this._detune = 'detune' in options ? options.detune : 0
    this._playbackRate = 'playbackRate' in options ? options.playbackRate : 1
    this._name = 'name' in options ? options.name : `${track.getName()} [${getSupervillain()}]`

    // placeholder to replace the fact that we dont have the sound effects
    this._hasFilters = false

    // source currently being played. Useful for interupting
    this._playingSource = null
  }


  getName(){
    return this._name
  }


  start(stopPrevious = true){
    if(stopPrevious){
      this.stop()
    }

    this._playingSource = this._track.createSource(false)
    this._playingSource.detune.value = this._detune
    // this._playingSource.playbackRate = this._playbackRate
    this._playingSource.connect(this._audioContext.destination)
    if(this._durationSeconds > 0){
      this._playingSource.start(0, this._offsetSeconds, this._durationSeconds)
    }else{
      this._playingSource.start(0, this._offsetSeconds)
    }
  }


  stop(){
    if(this._playingSource){
      this._playingSource.stop(0)
      this._playingSource = null
    }
  }

  setDetune(d){
    this._detune = d
  }

  setPlaybackRate(p){
    this._playbackRate = 1
  }



}

export default Sample
