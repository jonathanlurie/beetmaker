import EventManager from '@jonathanlurie/eventmanager'
import Track from './Track'

// emit event recordingEnded

// exaple here https://github.com/bryanjenningz/record-audio/blob/master/index.js
class MicRecorder extends EventManager{

  constructor(audioContext){
    super()
    this._audioContext = audioContext
    this._recorder = null
  }


  record(){
    if(this._recorder){
      console.log('Already recording')
      return
    }

    let that = this
    let audioChunks = []

    navigator.mediaDevices.getUserMedia({audio: true})
      .then(function(stream) {
        that._recorder = new MediaRecorder(stream)

        // record chunks of data
        that._recorder.addEventListener('dataavailable', function(e) {
            audioChunks.push(e.data)
        })

        // event for when it's going to stop
        that._recorder.addEventListener("stop", () => {
          // stop the mic to be active
          stream.getAudioTracks().forEach(at => {
            at.stop()
          })

          const audioBlob = new Blob(audioChunks)
          that._decodeBlog(audioBlob)
          that._recorder = null
        })

        that._recorder.start()
      })
  }


  _decodeBlog(audioBlob){
    let that = this
    let fileReader = new FileReader()

    fileReader.onload = function(e){
      that._audioContext.decodeAudioData(e.target.result,

        // success callback
        function(decodedAudioBuffer) {
          let track = new Track(`Mic record [${(new Date()).toISOString()}]`, decodedAudioBuffer, that._audioContext)
          that.emit('recordingEnded', [track])
        },

        // error callback
        function(e){
          console.log("Error with decoding audio data" + e.err)
        })
    }
    fileReader.readAsArrayBuffer(audioBlob)
  }


  stop(){
    if(!this._recorder){
      console.log('Needs to be recording to stop recording.')
      return
    }

    this._recorder.stop()
  }


}

export default MicRecorder
