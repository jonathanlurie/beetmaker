'use strict';

class Track {

  constructor(name, decodedBuffer, audioContext){
    this._name = name;
    this._decodedBuffer = decodedBuffer;
    this._audioContext = audioContext;
  }

  // act as a factory; because sources can only be played once
  createSource(connectToDestination = true){
    let source = this._audioContext.createBufferSource();
    source.buffer = this._decodedBuffer;

    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    if(connectToDestination){
      source.connect(this._audioContext.destination);
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
    let source = this.createSource(true);
    source.start(0, /*offsetSecond, durationSecond*/);
  }

}

class TrackCollection {

  constructor(audioContext=null){
    if(!audioContext){
      this._audioContext = new AudioContext();
    } else {
      this._audioContext = audioContext;
    }

    this._collection = {};
  }


  addFromFile(file, name=null){
    let effectiveName = name ? name : file.name;
    let that = this;
    let fileReader = new FileReader();

    fileReader.onload = function(e){
      that._audioContext.decodeAudioData(e.target.result,

        // success callback
        function(decodedAudioBuffer) {
          that._addTrack(decodedAudioBuffer, effectiveName, that._audioContext);
        },

        // error callback
        function(e){
          console.log("Error with decoding audio data" + e.err);
        });
    };
    fileReader.readAsArrayBuffer(file);
  }


  _addTrack(decodedAudioBuffer, name, audioContext){
    if(name in this._collection){
      throw new Error(`A track named ${name} already exists.`)
    }

    this._collection[name] = new Track(name, decodedAudioBuffer, audioContext);
  }

}

var index = ({
  TrackCollection,
});

module.exports = index;
//# sourceMappingURL=beetmaker.js.map
