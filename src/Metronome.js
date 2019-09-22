import EventManager from '@jonathanlurie/eventmanager'


/**
 * Note: subdivisions of:
 * - 1 allow only quarter notes (crochets, noires)
 * - 2 allow as fast as eighth notes (quavers, croches) - default
 * - 4 allow as fast as sixtenth notes (semiquavers, double-croches)
 * - 8 allow as fast as Thirty-second notes (demisemiquavers, quadruple-croches)
 *
 * @extends EventManager
 */
class Metronome extends EventManager{

  constructor(options={}){
    super()
    this._bpm = 'bpm' in options ? options.bpm : 80
    this._subdivisions = 'subdivisions' in options ? options.subdivisions : 4
    this._intervalMs = null
    this._beatIndex = 0
    this._subdivisionIndex = 0
    this._isStarted = false
    this._isPaused = false
    this._intervalId = 0

    this._updateIntervalMs()
  }


  isStarted(){
    return this._isStarted
  }

  isPaused(){
    return this._isPaused
  }

  /**
   * @private
   * Updates the interval in millisec between two contiguous beat subdivisions
   */
  _updateIntervalMs(){
    this._intervalMs = 1000 * 60 / this._bpm / this._subdivisions
  }


  getSubdivisionIntervalMs(){
    return this._intervalMs
  }


  setBpm(bpm){
    this.stop()
    this._bpm = bpm
    this._updateIntervalMs()
  }


  setSubdivisions(sd){
    this.stop()
    this._subdivisions = sd
    this._updateIntervalMs()
  }


  getSubdivisions(){
    return this._subdivisions
  }


  start(){
    if(this._isStarted && !this._isPaused){
      console.log('This metronome has already started.')
      return
    }

    let that = this
    this._isStarted = true

    this.emit('start')
    this._intervalId = setInterval(function(){
      that.emit('beat', [that._beatIndex, that._subdivisionIndex, that._subdivisions])

      // update the counters
      that._subdivisionIndex = (that._subdivisionIndex + 1) % that._subdivisions
      if(that._subdivisionIndex === 0){
        that._beatIndex ++
      }
    }, this._intervalMs)
  }


  stop(){
    if(!this._isStarted){
      console.log('The metronome must be started to be stopped.')
      return
    }


    this._beatIndex = 0
    this._subdivisionIndex = 0
    this._isStarted = false
    this._isPaused = false
    this.emit('stop')
    clearInterval(this._intervalId)
  }


  pause(){
    if(!this._isStarted){
      console.log('The metronome must be started to be paused.')
      return
    }

    this._isPaused = true
    this.emit('pause')
    clearInterval(this._intervalId)
  }


  resume(){
    if(!this._isPaused){
      console.log('The metronome must be paused to be resumed.')
      return
    }

    this.start()
    this._isPaused = false
  }
}

export default Metronome
