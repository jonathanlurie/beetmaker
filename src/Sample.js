import getSupervillain from './Supervillains'

/**
 * A Sample is a subset of a track, potentially with some filters applied to it
 */
class Sample {

  constructor(track, audioContext, options={}){
    this._track = track
    this._audioContext = audioContext
    this._gainNode = this._audioContext.createGain()
    this._offsetSeconds = 'offsetSecond' in options ? options.offsetSecond : 0
    this._durationSeconds = 'durationSeconds' in options ? options.durationSeconds : null
    this._detune = 'detune' in options ? options.detune : 0
    this._playbackRate = 'playbackRate' in options ? options.playbackRate : 1
    this._name = 'name' in options ? options.name : `${track.getName()} [${getSupervillain()}]`

    this._volume = 1

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

    // remove the fading, so that it does not apply on the replayed sample
    this._gainNode.gain.cancelScheduledValues(this._audioContext.currentTime)

    // reset the volume so that it does not stay stuck to where the fading out left it
    this._gainNode.gain.setValueAtTime(this._volume, this._audioContext.currentTime)

    this._playingSource = this._track.createSource(false)
    this._playingSource.detune.value = this._detune
    // this._playingSource.playbackRate = this._playbackRate

    this._playingSource.connect(this._gainNode)
    this._gainNode.connect(this._audioContext.destination)


    if(this._durationSeconds > 0){
      this._playingSource.start(0, this._offsetSeconds, this._durationSeconds)
    }else{
      this._playingSource.start(0, this._offsetSeconds)
    }
  }


  setVolume(v){
    this._volume = v
    this._gainNode.gain.setValueAtTime(v, this._audioContext.currentTime)
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


  fadeOutLinear(durationSec){
    this._gainNode.gain.linearRampToValueAtTime(0, this._audioContext.currentTime + durationSec)
  }

  fadeOutExp(durationSec){
    this._gainNode.gain.exponentialRampToValueAtTime(0.05, this._audioContext.currentTime + durationSec)
  }

}

export default Sample
