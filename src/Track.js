class Track {

  constructor(name, decodedBuffer, audioContext){
    this._name = name
    this._decodedBuffer = decodedBuffer
    this._audioContext = audioContext
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


  getDuration(){
    return this._decodedBuffer.duration
  }


  getNumberOfChannels(){
    return this._decodedBuffer.numberOfChannels()
  }


  getSampleRate(){
    return this._decodedBuffer.sampleRate
  }


  play(){
    let source = this.createSource(true)
    source.start(0, /*offsetSecond, durationSecond*/)
  }

}

export default Track
