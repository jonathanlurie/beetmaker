import Track from './Track'

class TrackCollection {

  constructor(audioContext=null){
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
  }

}

export default TrackCollection
