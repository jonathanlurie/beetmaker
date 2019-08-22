class Track {

  constructor(name, decodedBuffer, audioContext){
    this._name = name
    this._decodedBuffer = decodedBuffer
    this._audioContext = audioContext

    // source currently being played. Useful for interupting
    this._playingSource = null
  }

  // act as a factory; because sources can only be played once
  createSource(connectToDestination = true){
    let source = this._audioContext.createBufferSource()
    source.buffer = this._decodedBuffer

    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    if(connectToDestination){
      source.connect(this._audioContext.destination)
    }
    return source
  }

  getName(){
    return this._name
  }


  getPcmData(channel=0){
    if(channel >= 0 && channel < this._decodedBuffer.numberOfChannels){
      return this._decodedBuffer.getChannelData(channel)
    }
    return null
  }


  getDuration(){
    return this._decodedBuffer.duration
  }


  getNumberOfChannels(){
    return this._decodedBuffer.numberOfChannels
  }


  getSampleRate(){
    return this._decodedBuffer.sampleRate
  }


  start(){
    let that = this

    // stopping it if already existing
    if(this._playingSource){
      this._playingSource.stop()
    }

    this._playingSource = this.createSource(true)

    // make it become null when it's stoped
    this._playingSource.onended = function(event) {
      that._playingSource = null
    }
    this._playingSource.start()
  }


  stop(){
    if(this._playingSource){
      this._playingSource.stop()
    }
  }

}

export default Track
