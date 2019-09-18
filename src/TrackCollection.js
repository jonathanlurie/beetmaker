import EventManager from '@jonathanlurie/eventmanager'
import Track from './Track'


/**
 * Event emitted:
 * - 'tracksAdded' with args: tracks: Array of Track - When some track(s) is just added to the collection
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


  addFromFile(files){
    let that = this

    function readFile(file){
      return new Promise((resolve, reject) => {
        let fr = new FileReader()
        fr.onload = () => {
          resolve(fr.result)
        }
        fr.readAsArrayBuffer(file)
      })
    }

    let fileArray = null

    if(files instanceof File){
      fileArray = [files]
    }else{
      fileArray = [...files].sort((a, b) =>  (a.name > b.name) ? 1 : -1)
    }

    // let fileArray = [...files].sort((a, b) =>  (a.name > b.name) ? 1 : -1)
    let names = fileArray.map(f => f.name)
    let readPromises = fileArray.map(f => readFile(f))

    Promise.all(readPromises)
    .then(arrBufs => {
      let decodePromises = arrBufs.map(arrBuf => that._audioContext.decodeAudioData(arrBuf))

      Promise.all(decodePromises)
      .then(decodedArrBufs => {
        that._addTracks(decodedArrBufs, names)
      })
    })

  }




  addFromUrl(urls){

    let urlList = null
    if(!Array.isArray(urls)){
      urlList = [urls]
    } else {
      urlList = urls
    }

    let that = this
    let names = urlList.map(url => url.replace(/^.*[\\\/]/, ''))

    let fetchPromises = urlList.map(url => fetch(url).then(y => y.arrayBuffer()));
    Promise.all(fetchPromises).then(arrBufs => {
      let decodePromises = arrBufs.map(arrBuf => that._audioContext.decodeAudioData(arrBuf))

      Promise.all(decodePromises)
      .then(decodedArrBufs => {
        that._addTracks(decodedArrBufs, names)
      })
    })
  }


  _addTracks(decodedAudioBuffers, names){
    let that = this

    let justAdded = []
    decodedAudioBuffers.forEach((dab, i) => {
      let name = names[i]

      if(name in that._collection){
        //throw new Error(`A track named ${name} already exists.`)
        // TODO: emit a custom event like 'trackError'
        return
      }

      that._collection[name] = new Track(name, dab, that._audioContext)
      justAdded.push(that._collection[name])
    })

    this.emit('tracksAdded', [justAdded])
  }


  _addTrack(decodedAudioBuffer, name, audioContext){
    if(name in this._collection){
      throw new Error(`A track named ${name} already exists.`)
    }

    this._collection[name] = new Track(name, decodedAudioBuffer, audioContext)
    this.emit('tracksAdded', [this._collection[name]])
  }




}

export default TrackCollection
