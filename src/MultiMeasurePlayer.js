
class MultiMeasurePlayer {
  constructor(metronome){
    this._metronome = metronome
    this._multiMeasures = {}

    this._metronome.on('beat', (beatIndex, subdivisionIndex) => {
      this._processMultiMeasures({
        beatIndex: beatIndex,
        subdivisionIndex:subdivisionIndex
      })
    })
  }


  addMultimeasure(mm, options={}){
    let id = 'id' in options ? options.id : Math.random().toString().split('.')[1]
    let startBeatIndex = 'startBeatIndex' in options ? options.startBeatIndex : 0
    let enabled = 'enabled' in options ? options.enabled : true

    this._multiMeasures[id] = {
      multiMeasure: mm,
      startBeatIndex: startBeatIndex,
      enabled: enabled
    }
    return id
  }


  _processMultiMeasures(metronomeConfig){
    Object.keys(this._multiMeasures)
      .forEach(id => {
        if(!this._multiMeasures[id].enabled)
          return

        let multiMeasure = this._multiMeasures[id].multiMeasure
        let startBeatIndex = this._multiMeasures[id].startBeatIndex
        multiMeasure.play(metronomeConfig.beatIndex - startBeatIndex, metronomeConfig.subdivisionIndex)
      })
  }


}

export default MultiMeasurePlayer
