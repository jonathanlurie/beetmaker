

class MultiMeasure {

  /**
   * The number of subdivision should be borrowed from the metronome
   *
   */
  constructor(options={}){
    this._config = ('config' in options ? '4/4' : options.config)
                      .split('/')
                      .map(n -> parseInt(n))
    this._beatsPerMeasure = this._config[0] * 4 / this._config[1]
    this._subdivisions = 'subdivisions' in options ? options.subdivisions : 4
    this._looping = 'looping' in options ? options.looping : false
    this._lastBeatIndex = 0
    this._content = {}
  }


  enableLooping(){
    this._looping = true
  }


  disableLooping(){
    this._looping = false
  }


  addSample(sample, beatIndex, subdivisionIndex){
    if(!(beatIndex in this._content)){
      this._content[beatIndex]
    }

    if(!(subdivisionIndex in this._content[beatIndex])){
      this._content[beatIndex][subdivisionIndex] = {}
    }

    this._content[beatIndex][subdivisionIndex][sample.getName()] = sample
    this._updateLastBeatIndex()
    // TODO: send event
  }


  removeSample(sampleName, beatIndex, subdivisionIndex){
    if(beatIndex in this._content &&
       subdivisionIndex in this._content[beatIndex] &&
       sampleName in this._content[beatIndex][subdivisionIndex])
    {
      delete this._content[beatIndex][subdivisionIndex][sampleName]

      // clean empty nodes
      if(Object.keys(this._content[beatIndex][subdivisionIndex]).length === 0){
          delete this._content[beatIndex][subdivisionIndex]
        if(Object.keys(this._content[beatIndex]).length === 0){
          delete this._content[beatIndex]
        }
      }

      this._updateLastBeatIndex()
      // TODO: send event
    }
  }


  /**
   * @private
   * Since we are playing with multiple measures, we have to know which beat index is ending the last measure.
   * The slot of this last beat index is possibly not used by any sample.
   */
  _updateLastBeatIndex(){
    let lastBeatSlotTaken = Math.max(...Object.keys(this._content))
    this._lastBeatIndex = Math.ceil(lastBeatSlotTaken/this._beatsPerMeasure) * this._beatsPerMeasure - 1
  }


  play(beatIndex, subdivisionIndex){
    let possiblyLoopedBeatIndex = beatIndex

    if(this._looping){
      possiblyLoopedBeatIndex = possiblyLoopedBeatIndex % (this._lastBeatIndex + 1)
    }

    if(possiblyLoopedBeatIndex <= this._lastBeatIndex){

      // anything to play here?
      // Beat level
      if(possiblyLoopedBeatIndex in this._content){
        // subdivision level
        if(subdivisionIndex in this._content[possiblyLoopedBeatIndex]){
          let samples = this._content[possiblyLoopedBeatIndex][subdivisionIndex]
          let sampleNames = Object.keys(samples)

          for(let i=0; i<sampleNames.length; i++){
            samples[sampleNames[i]].start()
          }
        }
      }
    }
  }



}

export default MultiMeasure
