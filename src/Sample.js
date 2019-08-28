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
    this._playingSource.connect(this._audioContext.destination)
    this._playingSource.start(0, this._offsetSeconds, this._durationSeconds)
  }


  stop(){
    if(this._playingSource){
      this._playingSource.stop(0)
      this._playingSource = null
    }
  }



}

export default Sample
