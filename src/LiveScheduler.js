/**
 * The LiveScheduler the intermediate between the request of playing a sample and
 * the sample actually being played. like in Ableton Live, a sample can be held to
 * be played only on the next beat or the next subdivision of beat
 * (ie. full, 1/2 or 1/4 if metronome is playing 4/4)
 */


class LiveScheduler {

  constructor(metronome, options={}){
    this._metronome = metronome
    this._lastBeatSubdivTimestampMs = Date.now()
    this._intervalEpsylon = 0.1
    this._lastBeatSubdivIndex = 0
    this._sampleStack = {}

    // by default mapped on the smallest subdivision of the metronome
    this._beatFrequency = 'beatFrequency' in options ? options.beatFrequency : (1 / metronome.getSubdivisions())
    this._metronome.on('beat', this._processBeatSubdiv.bind(this))
  }


  _processBeatSubdiv(beatIndex, subdivIndex, subdivTotal){
    this._lastBeatSubdivTimestampMs = Date.now()
    this._lastBeatSubdivIndex = subdivIndex

    let samplesNames = Object.keys(this._sampleStack)

    if(samplesNames.length === 0){
      return
    }

    let playScore = (subdivIndex / subdivTotal) % this._beatFrequency
    console.log(playScore);

    if(playScore !== 0){
      return
    }

    let sampleStackArray = samplesNames.map(k => this._sampleStack[k])
    this._sampleStack = {}
    // console.log('BOOM')
    while(sampleStackArray.length){
      sampleStackArray.pop().start()
    }

  }


  /**
   * The beat frequency is a ratio of beat on which we want to anchor samples startings.
   * For example, is bf is 1/4 then a given sample will be played at the next quarted of beat.
   * (unless it was added in a period of time epsilon after the last subdivision)
   * @param {[type]} bf [description]
   */
  setBeatFrequency(bf){
    this._beatFrequency = bf
  }


  /**
   * The interval epsylon is a percentage of the time between 2 subdivisions of metronome.
   * Per default, epsylon is 0.1, and per default the metronome is playing at 80BPM with
   * 4 subdivisions, this means there is 187.5ms between 2 subdivsision and 18.75ms of
   * tolerance for a sample. If a sample is added with this tolerance of time after
   * the metronome subdiv happens, it is played directly without stopping by the stack.
   * Setting the epsylon to 1 or more means the stack stack is not used and all the
   * samples added are played when they are added and not on the beat.
   */
  setIntervalEpsylon(e){
    this._intervalEpsylon = e
  }


  addSample(s){
    let currentTimestampMs = Date.now()
    let timeInterval = this._intervalEpsylon * this._metronome.getSubdivisionIntervalMs()
    let correctSubdiv = !((this._lastBeatSubdivIndex / this._metronome.getSubdivisions()) % this._beatFrequency)
    let onTime = (currentTimestampMs - this._lastBeatSubdivTimestampMs) < timeInterval
    // console.log(timeInterval);

    if(correctSubdiv && onTime){
      s.start()
      console.log('OFFBEAT')
    }else{
      // we don't want to add the same sample twice, so we identify it by its name
      // (honestly, nothing prevents 2 samples to be the same but with a different name
      // but that's not an issue)
      let name = s.getName()
      if(!(name in this._sampleStack)){
        this._sampleStack[name] = s
      }
    }
  }



}

export default LiveScheduler
