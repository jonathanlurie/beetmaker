

class Measure {

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
    this._measureContent = {}
  }


  addSample(sample, beatIndex, subdivisionIndex){
    if(!(beatIndex in this._measureContent)){
      this._measureContent[beatIndex]
    }

    if(!(subdivisionIndex in this._measureContent[beatIndex])){
      this._measureContent[beatIndex][subdivisionIndex] = {}
    }

    this._measureContent[beatIndex][subdivisionIndex][sample.getName()] = sample
    // TODO: send event
  }


  removeSample(sampleName, beatIndex, subdivisionIndex){
    if(beatIndex in this._measureContent &&
       subdivisionIndex in this._measureContent[beatIndex] &&
       sampleName in this._measureContent[beatIndex][subdivisionIndex])
    {
      delete this._measureContent[beatIndex][subdivisionIndex][sampleName]
      // TODO: send event
    }
  }



}

export default Measure
