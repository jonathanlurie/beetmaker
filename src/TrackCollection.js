import EventManager from '@jonathanlurie/eventmanager'
import Track from './Track'


/**
 * Event emitted:
 * - 'trackAdded' with args: track:Track - When a track is just added to the collection
 *
 */
class TrackCollection extends EventManager{

  constructor(audioContext=null){
    super()

    if(!audioContext){
      this._audioContext = new AudioContext()
    } else {
      this._audioContext = audioContext
    }

    this._collection = {}
  }


  addFromFile(file, name=null){
    let effectiveName = name ? name : file.name
    let that = this
    let fileReader = new FileReader()

    fileReader.onload = function(e){
      that._audioContext.decodeAudioData(e.target.result,

        // success callback
        function(decodedAudioBuffer) {
          that._addTrack(decodedAudioBuffer, effectiveName, that._audioContext)
        },

        // error callback
        function(e){
          console.log("Error with decoding audio data" + e.err)
        })
    }
    fileReader.readAsArrayBuffer(file)
  }


  _addTrack(decodedAudioBuffer, name, audioContext){
    if(name in this._collection){
      throw new Error(`A track named ${name} already exists.`)
    }

    this._collection[name] = new Track(name, decodedAudioBuffer, audioContext)
    this.emit('trackAdded', [this._collection[name]])
  }

}

export default TrackCollection
