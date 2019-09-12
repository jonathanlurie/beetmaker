import EventManager from '@jonathanlurie/eventmanager';

class Track {

  constructor(name, decodedBuffer, audioContext){
    this._name = name;
    this._decodedBuffer = decodedBuffer;
    this._audioContext = audioContext;

    // source currently being played. Useful for interupting
    this._playingSource = null;
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
    let that = this;

    // stopping it if already existing
    if(this._playingSource){
      this._playingSource.stop();
    }

    this._playingSource = this.createSource(true);

    // make it become null when it's stoped
    this._playingSource.onended = function(event) {
      that._playingSource = null;
    };
    this._playingSource.start();
  }


  stop(){
    if(this._playingSource){
      this._playingSource.stop();
    }
  }

}

/**
 * Event emitted:
 * - 'trackAdded' with args: track:Track - When a track is just added to the collection
 *
 */
class TrackCollection extends EventManager{

  constructor(audioContext=null){
    super();

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


  addFromUrl(url, name=null){
    let effectiveName = name ? name : url.replace(/^.*[\\\/]/, '');
    let that = this;

    fetch(url)
    .then(res => {
      return res.arrayBuffer()
    })
    .then(arrrBuff => {
      that._audioContext.decodeAudioData(arrrBuff,

        // success callback
        function(decodedAudioBuffer) {
          that._addTrack(decodedAudioBuffer, effectiveName, that._audioContext);
        },

        // error callback
        function(e){
          console.log("Error with decoding audio data" + e.err);
        });
    });
  }


  _addTrack(decodedAudioBuffer, name, audioContext){
    if(name in this._collection){
      throw new Error(`A track named ${name} already exists.`)
    }

    this._collection[name] = new Track(name, decodedAudioBuffer, audioContext);
    this.emit('trackAdded', [this._collection[name]]);
  }

}

let supervillains = [
	"Abattoir",
	"Able Crown",
	"Abra Kadabra",
	"Absorbing Man",
	"Acolytes",
	"Acrobat",
	"Advanced Idea Mechanics",
	"Agamemno",
	"Agent H of HYDRA",
	"Al-Tariq",
	"Alberto Falcone",
	"Alex Wilder",
	"Alkhema",
	"Allatou",
	"Amazing Grace",
	"Amazo",
	"Americop",
	"Amos Fortune",
	"Amygdala",
	"Anaconda",
	"Anarky",
	"Animora",
	"Annihilus",
	"Anomaly",
	"Answer",
	"Anthony Lupus",
	"Apocalypse",
	"Appa Ali Apsa",
	"Aqueduct",
	"Arcade",
	"Aries",
	"Arkon",
	"Armadillo",
	"Artemis Crock",
	"Artemiz",
	"Asbestos Man",
	"Assembly of Evil",
	"Atomic Skull",
	"Attuma",
	"Axis Amerika",
	"Ballox the Monstroid",
	"Bane",
	"Baron Blitzkrieg",
	"Baron Blood",
	"Baron Mordo",
	"Baron Zemo",
	"Barracuda",
	"Batroc the Leaper",
	"Battleaxe",
	"Batzarro",
	"Bernadeth",
	"Bizarro",
	"Black Adam",
	"Black Flash",
	"Black Hand",
	"Black Knight",
	"Black Manta",
	"Black Mask",
	"Black Spider",
	"Black Talon",
	"Black Widow",
	"Black Zero",
	"Blackfire",
	"Blackout",
	"Blackrock",
	"Blacksmith",
	"Blastaar",
	"Blaze",
	"Blockbuster",
	"Bloodsport",
	"Bloody Mary",
	"Blue Snowman",
	"Blue Streak",
	"Bolivar Trask",
	"Brainiac",
	"Brainwave",
	"Bronze Tiger",
	"Brutale",
	"Bug-Eyed Bandit",
	"Bullseye",
	"Byth",
	"Calculator",
	"Calendar Man",
	"Captain Boomerang",
	"Captain Cold",
	"Captain Nazi",
	"Captain Stingaree",
	"Carmine Falcone",
	"Carnage",
	"Catman",
	"Catwoman",
	"Cavalier",
	"Chameleon",
	"Cheetah",
	"Cheshire",
	"Chessure",
	"Chronos",
	"Chthon",
	"Cicada",
	"Circe",
	"Clayface",
	"Clock King",
	"Cluemaster",
	"Cobalt Blue",
	"Cobalt Man",
	"Cold War",
	"Commissioner Gillian B. Loeb",
	"Composite Superman",
	"Conduit",
	"Constrictor",
	"Copperhead",
	"Cornelius Stirk",
	"Count Nefaria",
	"Count Vertigo",
	"Crazy Quilt",
	"Crime Doctor",
	"Crimesmith",
	"Crimson Dynamo",
	"Crossbones",
	"Crossfire",
	"Cutthroat",
	"Cyborgirl",
	"Dansen Macabre",
	"Dark Angel",
	"Darkseid",
	"Darth Vader",
	"David Cain",
	"Deacon Blackfire",
	"Deadline",
	"Deadpool",
	"Deadshot",
	"Death Storm",
	"Deathbird",
	"Deathbolt",
	"Deathstroke",
	"Decay",
	"Deep Six",
	"Desaad",
	"Despero",
	"Destiny",
	"Destroyer",
	"Deuce",
	"Deuce, Charger",
	"Devastation",
	"Devilance",
	"Diablo",
	"Diamond Lil",
	"Doctor Achilles Milo",
	"Doctor Alchemy",
	"Doctor Bedlam",
	"Doctor Cyber",
	"Doctor Demonicus",
	"Doctor Destiny",
	"Doctor Doom",
	"Doctor Double X",
	"Doctor Moon",
	"Doctor Octopus",
	"Doctor Phosphorus",
	"Doctor Poison",
	"Doctor Polaris",
	"Doctor Sivana",
	"Doctor Spectrum",
	"Dominus",
	"Doomsday",
	"Dormammu",
	"Double Dare",
	"Double Down",
	"Dr. Death",
	"Dr. Evil",
	"Dr. Horrible",
	"Dr. Light",
	"Dragon Man",
	"Dragonfly",
	"Dragonrider",
	"Duela Dent",
	"Eclipso",
	"Eduardo",
	"Effron the Sorcerer",
	"Egghead",
	"Electro",
	"Electrocutioner",
	"Elektro",
	"Emerald Empress",
	"Emma Frost",
	"Enchantress",
	"Equus",
	"Ereshkigal",
	"Evil Ernie",
	"Eviless",
	"Evinlea",
	"Executioner",
	"Exemplars",
	"Fabian Cortez",
	"Facade",
	"Factor Three",
	"Fadeaway Man",
	"Famine",
	"Faora",
	"Fatality",
	"Fault Zone",
	"Fearsome Five",
	"Fel Andar",
	"Felix Faust",
	"Fem Paragon",
	"Female Furies",
	"Fer-de-Lance",
	"Film Freak",
	"Fin Fang Foom",
	"Firebug",
	"Firefly",
	"Fisherman",
	"Fixer",
	"Flag-Smasher",
	"Floronic Man",
	"Freedom Force",
	"Frightful Four",
	"Fuzzy Lumpkins",
	"Galactus",
	"Gambler",
	"Gargantua",
	"Gargantus",
	"Gargoyle",
	"Gearhead",
	"Gemini",
	"General",
	"General Zod",
	"Gentleman Ghost",
	"Ghaur",
	"Giganta",
	"Gilotina",
	"Girder",
	"Gizmo",
	"Gladiator",
	"Glorious Godfrey",
	"Glorith",
	"Goddess",
	"Godiva",
	"Gog",
	"Golden Glider",
	"Goldface",
	"Goldilocks",
	"Googam",
	"Goom",
	"Gorilla Grodd",
	"Gorilla-Man",
	"Grand Director",
	"Granny Goodness",
	"Graviton",
	"Grayven",
	"Great White",
	"Green Goblin",
	"Griffin",
	"Grim Reaper",
	"Grottu",
	"Growing Man",
	"H.I.V.E.",
	"HYDRA",
	"Hades",
	"Halflife",
	"Hangman",
	"Hank Henshaw",
	"Harlequin",
	"Harley Quinn",
	"Harpy",
	"Hate-Monger",
	"Hath-Set",
	"Hazard",
	"Headlok",
	"Heat Wave",
	"Hector Hammond",
	"Heggra",
	"Hela",
	"Hellgrammite",
	"High Evolutionary",
	"Hitman",
	"Hobgoblin",
	"Holiday",
	"Hugo Strange",
	"Hulk Robot",
	"Humpty Dumpty",
	"Hush",
	"Hyathis",
	"Hyena",
	"Hyperion",
	"Hypnota",
	"Ibac",
	"Ignition",
	"Immortus",
	"Impala",
	"Imperiex",
	"Impossible Man",
	"Indigo",
	"Inertia",
	"Infant Terrible",
	"Inferno",
	"Ingra",
	"Intergang",
	"Ion",
	"Iron Maiden",
	"Jack Frost",
	"Jack O'Lantern",
	"Jason Kreis",
	"Jason Todd",
	"Javelin",
	"Jax-Ur",
	"Jewelee",
	"Jigsaw",
	"Jinx",
	"Joker",
	"Juggernaut",
	"KGBeast",
	"Kalibak",
	"Kang the Conqueror",
	"Kanjar Ro",
	"Kanto",
	"Killer Croc",
	"Killer Frost",
	"Killer Moth",
	"King Ghidorah",
	"King Shark",
	"King Snake",
	"Kingpin",
	"Kira",
	"Kite Man",
	"Klaw",
	"Kleinstocks",
	"Knockout",
	"Korvac",
	"Kraven the Hunter",
	"Krona",
	"Kryptonite Man",
	"Kulan Gath",
	"Kurrgo",
	"Kyle Abbot",
	"Lady Clay",
	"Lady Death",
	"Lady Deathstrike",
	"Lady Dorma",
	"Lady Mastermind",
	"Lady Octopus",
	"Lady Shiva",
	"Lady Spellbinder",
	"Lady Vic",
	"Lagomorph",
	"Lashina",
	"Lava Men",
	"Law",
	"Lazara",
	"League of Assassins",
	"Leap-Frog",
	"Leather",
	"Legion of the Unliving",
	"Letha",
	"Lethal Legion",
	"Lex Luthor",
	"Lion-Mane",
	"Livewire",
	"Living Laser",
	"Lloigoroth",
	"Llyra",
	"Lock-Up",
	"Lodestone",
	"Loki",
	"Lorelei",
	"Lotso",
	"Lucifer",
	"Lynx",
	"MODOK",
	"Mace Blitzkrieg",
	"Mad Harriet",
	"Mad Hatter",
	"Mad Thinker",
	"Madvillain",
	"Madame Masque",
	"Madame Rouge",
	"Madelyne Pryor",
	"Maelstrom",
	"Magenta",
	"Magneta",
	"Magneto",
	"Magpie",
	"Magus",
	"Mai Shen",
	"Major Disaster",
	"Major Force",
	"Malebolgia",
	"Malice",
	"Malice Vundabar",
	"Mammon",
	"Mammoth",
	"Man Beast",
	"Man-Bat",
	"Man-Killer",
	"Manchester Black",
	"Mandarin",
	"Mandarin's Minions",
	"Manhunters",
	"Mantis",
	"Marrow",
	"Massacre",
	"Master Mold",
	"Master Pandemonium",
	"Master of the World",
	"Mastermind",
	"Masters of Evil",
	"Matter Master",
	"Maxie Zeus",
	"Maxima",
	"Maximus",
	"Medusa",
	"Menace",
	"Mephisto",
	"Mercy",
	"Merlyn",
	"Metallo",
	"MF DOOM",
	"Midnight Sun",
	"Mimic",
	"Mindblast",
	"Miracle Man",
	"Mirror Master",
	"Misfit",
	"Mist",
	"Mister Hyde",
	"Mister Sinister",
	"Mojo Jojo",
	"Mole Man",
	"Molecule Man",
	"Molloch",
	"Moloid subterraneans",
	"Molten Man",
	"Molten Man-Thing",
	"Mongal",
	"Mongul",
	"Mongul II",
	"Monocle",
	"Monsieur Stigmonus",
	"Moondark",
	"Moonstone",
	"Morgan Edge",
	"Morgan le Fay",
	"Morlun",
	"Mortalla",
	"Mortician",
	"Moses Magnum",
	"Mothergod",
	"Mr. Felonious Gru",
	"Mr. Freeze",
	"Mr. Mxyzptlk",
	"Mr. Twister",
	"Mud Pack",
	"Murmur",
	"Mysteria",
	"Mysterio",
	"Mystique",
	"NKVDemon",
	"Naga",
	"Nebula",
	"Needle",
	"Nemesis Kid",
	"Nero",
	"Neron",
	"Neutron",
	"New Wave",
	"Nightmare",
	"Nocturna",
	"Northwind",
	"Nyssa Raatko",
	"O.G.R.E.",
	"Ocean Master",
	"Omega Red",
	"Onimar Synn",
	"Onomatopoeia",
	"Onslaught",
	"Orca",
	"Ord",
	"Orka",
	"Osira",
	"Overlord",
	"Owen Mercer",
	"Owlman",
	"Ozymandias",
	"Parademon",
	"Parademons",
	"Paragon",
	"Parallax",
	"Parasite",
	"Paste-Pot Pete",
	"Peek-a-Boo",
	"Penguin",
	"Penny Plunderer",
	"Persuader",
	"Phantazia",
	"Pharaoh Rama Tut",
	"Pharzoof",
	"Phobia",
	"Pied Piper",
	"Pink Pearl",
	"Plantman",
	"Plastique",
	"Poison Ivy",
	"Porcupine",
	"Portal",
	"Poundcakes",
	"Power Man",
	"Prank",
	"Prankster",
	"Pretty Persuasions",
	"Preus",
	"Princess Morbucks",
	"Princess Python",
	"Professor Hugo Strange",
	"Professor Ivo",
	"Professor Padraic Ratigan",
	"Prometheus",
	"Psycho-Man",
	"Psycho-Pirate",
	"Punisher",
	"Purgatori",
	"Quantum",
	"Queen Bee",
	"Queen Clea",
	"Queen of Fables",
	"Quicksand",
	"Quicksilver",
	"Qwsp",
	"Ra's al Ghul",
	"Rad",
	"Radioactive Man",
	"Rag Doll",
	"Rainbow Raider",
	"Rainbow Raiders",
	"Rampage",
	"Ratcatcher",
	"Reaper",
	"Red Ghost",
	"Red Hood",
	"Red Skull",
	"Resistants",
	"Reverse Flash",
	"Riddler",
	"Riddler's Daughter",
	"Ringmaster",
	"Ronan the Accuser",
	"Rose, Thorn",
	"Roulette",
	"Roxy Rocket",
	"Royal Flush Gang",
	"Rupert Thorne",
	"Russian",
	"SKULL",
	"Sabbac",
	"Sabretooth",
	"Salome",
	"Sandman",
	"Sat-Yr9",
	"Saturn Queen",
	"Savitar",
	"Scandal",
	"Scarecrow",
	"Scarlet Witch",
	"Scavenger",
	"Scorch",
	"Scorpia",
	"Scream",
	"Sebastian Shaw",
	"Sedusa",
	"Selene",
	"Sensei",
	"Sentinels",
	"Set",
	"Shadow Thief",
	"Shark",
	"Shimmer",
	"Shredder",
	"Shriek",
	"Shrike",
	"Signalman",
	"Silk Fever",
	"Silver Banshee",
	"Silver Sable",
	"Silver Swan",
	"Sin",
	"Sinestro",
	"Sinister Six",
	"Snapdragon",
	"Solaris",
	"Solomon Grundy",
	"Sonar",
	"Southpaw",
	"Space Phantom",
	"Speed Queen",
	"Spellbinder",
	"Spencer Smythe",
	"Sphinx",
	"Spider Girl",
	"Spider-Woman",
	"Spiral",
	"Sportsmaster",
	"Spragg",
	"Stained Glass Scarlet",
	"Star Sapphire",
	"Starro",
	"Stegron",
	"Stompa",
	"Sun Girl",
	"Super-Skrull",
	"Superia",
	"Superman Revenge Squad",
	"Supreme Intelligence",
	"Swordsman",
	"Syndrome",
	"T.O. Morrow",
	"Tala",
	"Talia al Ghul",
	"Tally Man",
	"Talon",
	"Tar Pit",
	"Tarantula",
	"Tattooed Man",
	"Ten-Eyed Man",
	"Terra",
	"Terra-Man",
	"Terraxia",
	"Terrible Trio",
	"Thanos",
	"The Amoeba Boys",
	"The Awesome Android",
	"The Basilisk",
	"The Blob",
	"The Borg",
	"The Chameleon",
	"The Crimson Ghost",
	"The Fat Man",
	"The Fiddler",
	"The Gargoyle",
	"The Ganggreen Gang",
	"The General",
	"The Joker",
	"The Kree",
	"The Leader",
	"The Lightning",
	"The Lizard",
	"The Mad Mod",
	"The Man-Killer",
	"The Mekon",
	"The Monk",
	"The Orb",
	"The Penguin",
	"The Puppet Master",
	"The Puzzler",
	"The Rhino",
	"The Rival",
	"The Rowdyruff Boys",
	"The Scorpion",
	"The Separated Man",
	"The Shade",
	"The Shocker",
	"The Skrulls",
	"The Stranger",
	"The Terrible Tinkerer",
	"The Terrible Trio",
	"The Top",
	"The Vulture",
	"The Wingless Wizard",
	"The Wink",
	"The Yellow Claw",
	"They Who Wield Power",
	"Thinker",
	"Tigress",
	"Tim Boo Ba",
	"Titan",
	"Titania",
	"Titanium Man",
	"Titano",
	"Toad",
	"Tony Zucco",
	"Toyman",
	"Trickster",
	"Trigger Twins",
	"Trinity",
	"Tsunami",
	"Turtle",
	"Tweedledum",
	"Two-Face",
	"Typhoid Mary",
	"Ultra-Humanite",
	"Ultraman",
	"Ultron",
	"Umar",
	"Unicron",
	"Unus the Untouchable",
	"Ursa",
	"Valentina",
	"Vandal Savage",
	"Vanisher",
	"Vapor",
	"Venom",
	"Ventriloquist",
	"Vermin",
	"Vertigo",
	"Victor Zsasz",
	"Violator",
	"Viper",
	"Virman Vundabar",
	"Volcana",
	"Vulture",
	"Warlord Zemu",
	"Warmaker",
	"Weather Wizard",
	"Whiplash",
	"White Rabbit",
	"Winter Soldier",
	"Xemnu",
	"Yancy Street Gang",
	"Yellowjacket",
	"Yuga Khan",
	"Zaladane",
	"Zaran",
	"Zeiss",
	"Zoom",
	"Zsasz"
];


function getSupervillain(){
  return supervillains[~~(Math.random() * supervillains.length)]
}

/**
 * A Sample is a subset of a track, potentially with some filters applied to it
 */
class Sample {

  constructor(track, audioContext, options={}){
    this._track = track;
    this._audioContext = audioContext;
    this._offsetSeconds = 'offsetSecond' in options ? options.offsetSecond : 0;
    this._durationSeconds = 'durationSeconds' in options ? options.durationSeconds : null;
    this._detune = 'detune' in options ? options.detune : 0;
    this._playbackRate = 'playbackRate' in options ? options.playbackRate : 1;
    this._name = 'name' in options ? options.name : `${track.getName()} [${getSupervillain()}]`;

    // placeholder to replace the fact that we dont have the sound effects
    this._hasFilters = false;

    // source currently being played. Useful for interupting
    this._playingSource = null;
  }


  getName(){
    return this._name
  }


  start(stopPrevious = true){
    if(stopPrevious){
      this.stop();
    }

    this._playingSource = this._track.createSource(false);
    this._playingSource.detune.value = this._detune;
    // this._playingSource.playbackRate = this._playbackRate
    this._playingSource.connect(this._audioContext.destination);
    if(this._durationSeconds > 0){
      this._playingSource.start(0, this._offsetSeconds, this._durationSeconds);
    }else{
      this._playingSource.start(0, this._offsetSeconds);
    }
  }


  stop(){
    if(this._playingSource){
      this._playingSource.stop(0);
      this._playingSource = null;
    }
  }

  setDetune(d){
    this._detune = d;
  }

  setPlaybackRate(p){
    this._playbackRate = 1;
  }



}

class BlankSampler {

  constructor(track, audioContext, options={}){
    this._blankDurationSec = 'blankDurationSec' in options ? options.blankDurationSec : 0.2;
    this._sampleDurationSec = 'sampleDurationSec' in options ? options.sampleDurationSec : 0.5;
    this._pcmThreshold = 'pcmThreshold' in options ? options.pcmThreshold : 0.02;
    this._track = track;
    this._audioContext = audioContext;
    this._nonBlankSequences = null;
  }


  analyse(){
    let abs = Math.abs;
    let channels = [];
    for(let i=0; i<this._track.getNumberOfChannels(); i++){
      channels.push(this._track.getPcmData(i));
    }

    if(this._pcmThreshold === 'auto'){
      // find pcm min max and avg (in abs value) to make a smart pcmThreshold
      let min = Infinity;
      let avg = 0;
      for(let i=0; i<channels[0].length; i++){
        for(let j=0; j<channels.length; j++){
          let pcmVal = abs(channels[j][i]);
          min = Math.min(min, pcmVal);
          avg += pcmVal;
        }
      }
      avg /= (channels.length * channels[0].length);
      this._pcmThreshold = min + (avg - min) * 0.6;
    }



    let blankDuration = ~~(this._blankDurationSec * this._track.getSampleRate());
    let sampleDuration = ~~(this._sampleDurationSec * this._track.getSampleRate());

    let blankSequences = [];
    let soundingSequences = [];
    let isBlank = true;
    let blankStart = 0;

    for(let i=0; i<channels[0].length; i++){

      // all channel at this sample are bellow the threshold
      let allBellowThres = true;
      for(let j=0; j<channels.length; j++){
        if(abs(channels[j][i]) > this._pcmThreshold){
          allBellowThres = false;
          break
        }
      }

      // a blank is starting
      if(!isBlank && allBellowThres){
        isBlank = true;
        blankStart = i;
      } else
      // a blank is ending
      if(isBlank && !allBellowThres){
        isBlank = false;
        blankSequences.push([blankStart, i]);
        blankStart = 0;
      }
    }

    // close a blank that may have started and lasted until the end of the track
    if(isBlank){
      blankSequences.push([blankStart, channels[0].length-1]);
    }

    // filter out the blanks that are too short
    blankSequences = blankSequences.filter(seq => {
      return (seq[1] - seq[0]) > blankDuration
    });

    if(blankSequences.length === 0){
      console.log('There is no blank in this track');
      return
    }

    // make a negative of the blanks to get the sounding parts
    let flat = [0];
    for(let i=0; i<blankSequences.length; i++){
      flat.push(blankSequences[i][0], blankSequences[i][1]);
    }

    for(let i=0; i<flat.length-2; i+=2){
      soundingSequences.push([flat[i], flat[i+1]]);
    }

    // filter out all the sound sequences that are too short
    soundingSequences = soundingSequences.filter(seq => {
      return (seq[1] - seq[0]) > sampleDuration
    });

    this._nonBlankSequences = soundingSequences;
  }


  createSamples(){
    if(this._nonBlankSequences === null){
      return null
    }

    let sampleRate = this._track.getSampleRate();
    let samples = [];

    for(let i=0; i<this._nonBlankSequences.length; i++){
      let secStart = this._nonBlankSequences[i][0] / sampleRate;
      let secDuration = (this._nonBlankSequences[i][1] - this._nonBlankSequences[i][0]) / sampleRate;
      let s = new Sample(this._track, this._audioContext, {
        offsetSecond: secStart,
        durationSeconds: secDuration,
        name: `${this._track.getName()} [${(~~(secStart*100))/100} -> ${(~~((secStart+secDuration)*100))/100}]`
      });
      samples.push(s);
    }

    return samples
  }

}

// emit event recordingEnded

// exaple here https://github.com/bryanjenningz/record-audio/blob/master/index.js
class MicRecorder extends EventManager{

  constructor(audioContext){
    super();
    this._audioContext = audioContext;
    this._recorder = null;
  }


  record(){
    if(this._recorder){
      console.log('Already recording');
      return
    }

    let that = this;
    let audioChunks = [];

    navigator.mediaDevices.getUserMedia({audio: true})
      .then(function(stream) {
        that._recorder = new MediaRecorder(stream);

        // record chunks of data
        that._recorder.addEventListener('dataavailable', function(e) {
            audioChunks.push(e.data);
        });

        // event for when it's going to stop
        that._recorder.addEventListener("stop", () => {
          // stop the mic to be active
          stream.getAudioTracks().forEach(at => {
            at.stop();
          });

          const audioBlob = new Blob(audioChunks);
          that._decodeBlog(audioBlob);
          that._recorder = null;
        });

        that._recorder.start();
      });
  }


  _decodeBlog(audioBlob){
    let that = this;
    let fileReader = new FileReader();

    fileReader.onload = function(e){
      that._audioContext.decodeAudioData(e.target.result,

        // success callback
        function(decodedAudioBuffer) {
          let track = new Track(`Mic record [${(new Date()).toISOString()}]`, decodedAudioBuffer, that._audioContext);
          that.emit('recordingEnded', [track]);
        },

        // error callback
        function(e){
          console.log("Error with decoding audio data" + e.err);
        });
    };
    fileReader.readAsArrayBuffer(audioBlob);
  }


  stop(){
    if(!this._recorder){
      console.log('Needs to be recording to stop recording.');
      return
    }

    this._recorder.stop();
  }


}

/**
 * Note: subdivisions of:
 * - 1 allow only quarter notes (crochets, noires)
 * - 2 allow as fast as eighth notes (quavers, croches) - default
 * - 4 allow as fast as sixtenth notes (semiquavers, double-croches)
 * - 8 allow as fast as Thirty-second notes (demisemiquavers, quadruple-croches)
 *
 * @extends EventManager
 */
class Metronome extends EventManager{

  constructor(options={}){
    super();
    this._bpm = 'bpm' in options ? options.bpm : 80;
    this._subdivisions = 'subdivisions' in options ? options.subdivisions : 4;
    this._intervalMs = null;
    this._beatIndex = 0;
    this._subdivisionIndex = 0;
    this._isStarted = false;
    this._isPaused = false;
    this._intervalId = 0;

    this._updateIntervalMs();
  }


  /**
   * @private
   * Updates the interval in millisec between two contiguous beat subdivisions
   */
  _updateIntervalMs(){
    this._intervalMs = 1000 * 60 / this._bpm / this._subdivisions;
  }


  setBpm(bpm){
    this.stop();
    this._bpm = bpm;
    this._updateIntervalMs();
  }


  setSubdivisions(sd){
    this.stop();
    this._subdivisions = sd;
    this._updateIntervalMs();
  }


  start(){
    if(this._isStarted && !this._isPaused){
      console.log('This metronome has already started.');
      return
    }

    let that = this;
    this._isStarted = true;

    this.emit('start');
    this._intervalId = setInterval(function(){
      that.emit('beat', [that._beatIndex, that._subdivisionIndex]);

      // update the counters
      that._subdivisionIndex = (that._subdivisionIndex + 1) % that._subdivisions;
      if(that._subdivisionIndex === 0){
        that._beatIndex ++;
      }
    }, this._intervalMs);
  }


  stop(){
    if(!this._isStarted){
      console.log('The metronome must be started to be stopped.');
      return
    }

    this._beatIndex = 0;
    this._subdivisionIndex = 0;
    this._isStarted = false;
    this.emit('stop');
    clearInterval(this._intervalId);
  }


  pause(){
    if(!this._isStarted){
      console.log('The metronome must be started to be paused.');
      return
    }

    this._isPaused = true;
    this.emit('pause');
    clearInterval(this._intervalId);
  }


  resume(){
    if(!this._isPaused){
      console.log('The metronome must be paused to be resumed.');
      return
    }

    this.start();
    this._isPaused = false;
  }
}

var index = ({
  TrackCollection,
  Track,
  Sample,
  BlankSampler,
  MicRecorder,
  Metronome
});

export default index;
//# sourceMappingURL=beetmaker.js.map
