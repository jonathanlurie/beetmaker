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


  /**
   * Add one or multiple files
   * @param {File|FileList} files - some file(s)
   */
  addFromFile(files){
    let that = this

    // turn the async - callback based - file reader into a promise, in order to
    // use it with Promise.all and keep the order of stuff
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



  /**
   * Add sound file from one or more urls
   * @param {string|Array} urls - the urls the sound files
   */
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



}

export default TrackCollection
