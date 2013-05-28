(function(sc) {
  "use strict";

  function Scale(degrees, pitchesPerOctave, tuning, name) {
    if (!Array.isArray(degrees)) {
      degrees = [0,2,4,5,7,9,11]; // ionian
    }
    if (typeof pitchesPerOctave !== "number") {
      pitchesPerOctave = Scale.guessPPO(degrees);
    }
    var _name;
    if (typeof tuning === "string") {
      _name = tuning;
      tuning = sc.TuningInfo.at(tuning);
    }
    if (!(tuning instanceof sc.Tuning)) {
      tuning = sc.Tuning["default"](pitchesPerOctave);
    }
    if (name === undefined) {
      name = _name;
    }
    if (typeof name !== "string") {
      name = "Unknown Scale";
    }
    this.name = name;
    this._degrees = degrees;
    this._pitchesPerOctave = pitchesPerOctave;
    this.tuning(tuning);
  }

  // ## tuning (inTuning:Tuning)
  // Sets or gets the tuning of the Scale.
  Scale.prototype.tuning = function(inTuning) {
    if (inTuning === undefined) {
      return this._tuning;
    }
    if (typeof inTuning === "string") {
      inTuning = sc.TuningInfo.at(inTuning);
    }
    if (!(inTuning instanceof sc.Tuning) ) {
      console.warn("The first argument must be instance of Tuning");
      return;
    }
    if (this._pitchesPerOctave !== inTuning.size()) {
      console.warn("Scale steps per octave " + this._pitchesPerOctave + " does not match tuning size ");
      return;
    }
    this._tuning = inTuning;
    this._ratios = this.semitones().midiratio();
    return inTuning;
  };
  // ## semitones ()
  // Returns a tuned array of semitone values
  Scale.prototype.semitones = function() {
    return this._degrees.map(this._tuning.wrapAt.bind(this._tuning));
  };
  // ## cents ()
  // Returns a turned array of cent values
  Scale.prototype.cents = function() {
    return this.semitones().map(function(x) {
      return x * 100;
    });
  };
  // ## ratios ()
  // Return a turned array of ratios
  Scale.prototype.ratios = function() {
    return this._ratios;
  };
  // ## size ()
  // Returns the length of the scale
  Scale.prototype.size = function() {
    return this._degrees.length;
  };
  // ## pitchesPerOctave ()
  // Returns the size of the pitch class set from which the tuning is drawn
  Scale.prototype.pitchesPerOctave = function() {
    return this._pitchesPerOctave;
  };
  // ## stepsPerOctave ()
  // Usually 12, but may be different if the current tuning has a stretched or compressed octave. Needed for degreeToKey
  Scale.prototype.stepsPerOctave = function() {
    return Math.log(this.octaveRatio()) * Math.LOG2E * 12;
  };
  // ## at (index:int)
  Scale.prototype.at = function(index) {
    return this._tuning.at(this._degrees.wrapAt(index));
  };
  // ## wrapAt (index:int)
  Scale.prototype.wrapAt = function(index) {
    return this._tuning.wrapAt(this._degrees.wrapAt(index));
  };
  // ## degreeToFreq (degree, rootFreq, octave)
  Scale.prototype.degreeToFreq = function(degree, rootFreq, octave) {
    return this.degreeToRatio(degree, octave) * rootFreq;
  };
  // ## degreeToRatio (degree, octave=0)
  Scale.prototype.degreeToRatio = function(degree, octave) {
    if (typeof octave !== "number") { octave = 0; }
    octave += (degree / this._degrees.length)|0;
    return this.ratios().wrapAt(degree) * Math.pow(this.octaveRatio(), octave);
  };
  // ## checkTuningForMismatch (aTuning)
  Scale.prototype.checkTuningForMismatch = function(aTuning) {
    return this._pitchesPerOctave === aTuning.size();
  };
  // ## degrees ()
  Scale.prototype.degrees = function() {
    return this._degrees;
  };
  // ## guessPPO ()
  Scale.prototype.guessPPO = function() {
    return Scale.guessPPO(this._degrees);
  };
  // ## octaveRatio ()
  Scale.prototype.octaveRatio = function() {
    return this._tuning.octaveRatio();
  };
  // ## performDegreeToKey (scaleDegree, stepsPerOctave, accidental=0)
  Scale.prototype.performDegreeToKey = function(scaleDegree, stepsPerOctave, accidental) {
    if (typeof stepsPerOctave !== "number") { stepsPerOctave = this.stepsPerOctave(); }
    if (typeof accidental     !== "number") { accidental     = 0; }
    var basekey = this.wrapAt(scaleDegree);
    basekey += stepsPerOctave * ((scaleDegree / this.size())|0);
    if (accidental === 0) {
      return basekey;
    } else {
      return basekey + (accidental * (stepsPerOctave / 12));
    }
  };
  // ## performKeyToDegree (degree, stepsPerOctave=12)
  Scale.prototype.performKeyToDegree = function(degree, stepsPerOctave) {
    if (typeof stepsPerOctave !== "number") { stepsPerOctave = 12; }
    return this._degrees.performKeyToDegree(degree, stepsPerOctave);
  };
  // ## performNearestInList (degree)
  Scale.prototype.performNearestInList = function(degree) {
    return this._degrees.performNearestInList(degree);
  };
  // ## performNearestInScale (degree, stepsPerOctave=12)
  Scale.prototype.performNearestInScale = function(degree, stepsPerOctave) {
    if (typeof stepsPerOctave !== "number") { stepsPerOctave = 12; }
    return this._degrees.performNearestInScale(degree, stepsPerOctave);
  };
  // ## equals (argScale)
  Scale.prototype.equals = function(argScale) {
    return this.degrees().equals(argScale.degrees()) && this._tuning.equals(argScale._tuning);
  };
  // ## deepCopy ()
  Scale.prototype.deepCopy = function() {
    return new Scale(this._degrees.slice(),
                     this._pitchesPerOctave,
                     this._tuning.deepCopy(),
                     this.name);
  };

  // ## Scale.choose (size=7, pitchesPerOctave=12)
  // Creates a random scale from the library, constrained by size and pitchesPerOctave if desired
  Scale.choose = function(size, pitchesPerOctave) {
    if (typeof size !== "number") { size = 7; }
    if (typeof pitchesPerOctave !== "number") { pitchesPerOctave = 12; }
    return ScaleInfo.choose(function(x) {
      return x._degrees.length === size &&
        x._pitchesPerOctave === pitchesPerOctave;
    });
  };
  // ## Scale.guessPPO (degrees:Array)
  Scale.guessPPO = function(degrees) {
    if (!Array.isArray(degrees)) {
      return 128;
    }
    var i, max = degrees[0] || 0;
    for (i = degrees.length; i--; ) {
      if (degrees[i] > max) {
        max = degrees[i];
      }
    }
    var etTypes = [53,24,19,12];
    for (i = etTypes.length; i--; ) {
      if (max < etTypes[i]) {
        return etTypes[i];
      }
    }
    return 128;
  };

  // # ScaleInfo
  var ScaleInfo = sc.ScaleInfo = {};
  var scales    = {};

  // ## ScaleInfo.choose (selectFunc)
  ScaleInfo.choose = function(selectFunc) {
    var candidates = [];
    var keys = Object.keys(scales);
    var s;
    for (var i = keys.length; i--; ) {
      s = scales[keys[i]];
      if (typeof selectFunc !== "function" || selectFunc(s)) {
        candidates.push(s);
      }
    }
    s = candidates[(Math.random() * candidates.length)|0];
    if (s) {
      return s.deepCopy();
    }
  };
  // ## ScaleInfo.at (key)
  ScaleInfo.at = function(key) {
    var s = scales[key];
    if (s) { return s.deepCopy(); }
  };
  // ## ScaleInfo.names ()
  ScaleInfo.names = function() {
    var keys = Object.keys(scales);
    keys.sort();
    return keys;
  };
  // ## ScaleInfo.register (key, scale)
  ScaleInfo.register = function(key, scale) {
    if (typeof key === "string" && scale instanceof Scale) {
      scales[key] = scale;
      Scale[key] = (function(key) {
        return function(tuning) {
          var scale = scales[key].deepCopy();
          if (typeof tuning === "string") {
            tuning = sc.TuningInfo.at(tuning);
          }
          if (tuning instanceof sc.Tuning) {
            scale.tuning(tuning);
          }
          return scale;
        };
      }(key));
    }
  };

  ScaleInfo.register(
    "major", new Scale([0,2,4,5,7,9,11], 12, null, "Major")
  );
  ScaleInfo.register(
    "minor", new Scale([0,2,3,5,7,8,10], 12, null, "Natural Minor")
  );
  // ### TWELVE-TONES PER OCTAVE

  // ### 5 note scales
  sc.ScaleInfo.register(
    "minorPentatonic",
    new Scale([0,3,5,7,10], 12, "Minor Pentatonic")
  );
  sc.ScaleInfo.register(
    "majorPentatonic",
    new Scale([0,2,4,7,9], 12, "Major Pentatonic")
  );
  // ### another mode of major pentatonic
  sc.ScaleInfo.register(
    "ritusen",
    new Scale([0,2,5,7,9], 12, "Ritusen")
  );
  // ### another mode of major pentatonic
  sc.ScaleInfo.register(
    "egyptian",
    new Scale([0,2,5,7,10], 12, "Egyptian")
  );
  sc.ScaleInfo.register(
	"kumoi",
    new Scale([0,2,3,7,9], 12, "Kumoi")
  );
  sc.ScaleInfo.register(
	"hirajoshi",
    new Scale([0,2,3,7,8], 12, "Hirajoshi")
  );
  sc.ScaleInfo.register(
	"iwato",
    new Scale([0,1,5,6,10], 12, "Iwato")
  );
  sc.ScaleInfo.register(
	"chinese",
    new Scale([0,4,6,7,11], 12, "Chinese")
  );
  sc.ScaleInfo.register(
	"indian",
    new Scale([0,4,5,7,10], 12, "Indian")
  );
  sc.ScaleInfo.register(
	"pelog",
    new Scale([0,1,3,7,8], 12, "Pelog")
  );
  sc.ScaleInfo.register(
	"prometheus",
    new Scale([0,2,4,6,11], 12, "Prometheus")
  );
  sc.ScaleInfo.register(
	"scriabin",
    new Scale([0,1,4,7,9], 12, "Scriabin")
  );
  // ### han chinese pentatonic scales
  sc.ScaleInfo.register(
	"gong",
    new Scale([0,2,4,7,9], 12, "Gong")
  );
  sc.ScaleInfo.register(
	"shang",
    new Scale([0,2,5,7,10], 12, "Shang")
  );
  sc.ScaleInfo.register(
    "jiao",
    new Scale([0,3,5,8,10], 12, "Jiao")
  );
  sc.ScaleInfo.register(
    "zhi",
    new Scale([0,2,5,7,9], 12, "Zhi")
  );
  sc.ScaleInfo.register(
    "yu",
    new Scale([0,3,5,7,10], 12, "Yu")
  );
  // ### 6 note scales
  sc.ScaleInfo.register(
    "whole",
    new Scale([0,2,4,6,8,10], 12, "Whole Tone")
  );
  sc.ScaleInfo.register(
	"augmented",
    new Scale([0,3,4,7,8,11], 12, "Augmented")
  );
  sc.ScaleInfo.register(
	"augmented2",
    new Scale([0,1,4,5,8,9], 12, "Augmented 2")
  );
  // ### Partch's Otonalities and Utonalities
  sc.ScaleInfo.register(
    "partch_o1",
    new Scale([0,8,14,20,25,34], 43, "partch", "Partch Otonality 1")
  );
  sc.ScaleInfo.register(
	"partch_o2",
    new Scale([0,7,13,18,27,35], 43, "partch", "Partch Otonality 2")
  );
  sc.ScaleInfo.register(
    "partch_o3",
    new Scale([0,6,12,21,29,36], 43, "partch", "Partch Otonality 3")
  );
  sc.ScaleInfo.register(
    "partch_o4",
    new Scale([0,5,15,23,30,37], 43, "partch", "Partch Otonality 4")
  );
  sc.ScaleInfo.register(
    "partch_o5",
    new Scale([0,10,18,25,31,38], 43, "partch", "Partch Otonality 5")
  );
  sc.ScaleInfo.register(
    "partch_o6",
    new Scale([0,9,16,22,28,33], 43, "partch", "Partch Otonality 6")
  );
  sc.ScaleInfo.register(
    "partch_u1",
    new Scale([0,9,18,23,29,35], 43, "partch", "Partch Utonality 1")
  );
  sc.ScaleInfo.register(
    "partch_u2",
    new Scale([0,8,16,25,30,36], 43, "partch", "Partch Utonality 2")
  );
  sc.ScaleInfo.register(
    "partch_u3",
    new Scale([0,7,14,22,31,37], 43, "partch", "Partch Utonality 3")
  );
  sc.ScaleInfo.register(
    "partch_u4",
    new Scale([0,6,13,20,28,38], 43, "partch", "Partch Utonality 4")
  );
  sc.ScaleInfo.register(
    "partch_u5",
    new Scale([0,5,12,18,25,33], 43, "partch", "Partch Utonality 5")
  );
  sc.ScaleInfo.register(
    "partch_u6",
    new Scale([0,10,15,21,27,34], 43, "partch", "Partch Utonality 6")
  );
  // ### hexatonic modes with no tritone
  sc.ScaleInfo.register(
	"hexMajor7",
    new Scale([0,2,4,7,9,11], 12, "Hex Major 7")
  );
  sc.ScaleInfo.register(
    "hexDorian",
    new Scale([0,2,3,5,7,10], 12, "Hex Dorian")
  );
  sc.ScaleInfo.register(
    "hexPhrygian",
    new Scale([0,1,3,5,8,10], 12, "Hex Phrygian")
  );
  sc.ScaleInfo.register(
    "hexSus",
    new Scale([0,2,5,7,9,10], 12, "Hex Sus")
  );
  sc.ScaleInfo.register(
    "hexMajor6",
    new Scale([0,2,4,5,7,9], 12, "Hex Major 6")
  );
  sc.ScaleInfo.register(
    "hexAeolian",
    new Scale([0,3,5,7,8,10], 12, "Hex Aeolian")
  );
  // ### 7 note scales
  sc.ScaleInfo.register(
	"ionian",
    new Scale([0,2,4,5,7,9,11], 12, "Ionian")
  );
  sc.ScaleInfo.register(
	"dorian",
    new Scale([0,2,3,5,7,9,10], 12, "Dorian")
  );
  sc.ScaleInfo.register(
	"phrygian",
    new Scale([0,1,3,5,7,8,10], 12, "Phrygian")
  );
  sc.ScaleInfo.register(
	"lydian",
    new Scale([0,2,4,6,7,9,11], 12, "Lydian")
  );
  sc.ScaleInfo.register(
	"mixolydian",
    new Scale([0,2,4,5,7,9,10], 12, "Mixolydian")
  );
  sc.ScaleInfo.register(
	"aeolian",
    new Scale([0,2,3,5,7,8,10], 12, "Aeolian")
  );
  sc.ScaleInfo.register(
    "locrian",
    new Scale([0,1,3,5,6,8,10], 12, "Locrian")
  );
  sc.ScaleInfo.register(
	"harmonicMinor",
    new Scale([0,2,3,5,7,8,11], 12, "Harmonic Minor")
  );
  sc.ScaleInfo.register(
	"harmonicMajor",
    new Scale([0,2,4,5,7,8,11], 12, "Harmonic Major")
  );
  sc.ScaleInfo.register(
	"melodicMinor",
    new Scale([0,2,3,5,7,9,11], 12, "Melodic Minor")
  );
  sc.ScaleInfo.register(
    "melodicMinorDesc",
    new Scale([0,2,3,5,7,8,10], 12, "Melodic Minor Descending")
  );
  sc.ScaleInfo.register(
    "melodicMajor",
    new Scale([0,2,4,5,7,8,10], 12, "Melodic Major")
  );
  sc.ScaleInfo.register(
	"bartok",
    new Scale([0,2,4,5,7,8,10], 12, "Bartok")
  );
  sc.ScaleInfo.register(
	"hindu",
    new Scale([0,2,4,5,7,8,10], 12, "Hindu")
  );
  // ### raga modes
  sc.ScaleInfo.register(
    "todi",
    new Scale([0,1,3,6,7,8,11], 12, "Todi")
  );
  sc.ScaleInfo.register(
    "purvi",
    new Scale([0,1,4,6,7,8,11], 12, "Purvi")
  );
  sc.ScaleInfo.register(
    "marva",
    new Scale([0,1,4,6,7,9,11], 12, "Marva")
  );
  sc.ScaleInfo.register(
    "bhairav",
    new Scale([0,1,4,5,7,8,11], 12, "Bhairav")
  );
  sc.ScaleInfo.register(
    "ahirbhairav",
    new Scale([0,1,4,5,7,9,10], 12, "Ahirbhairav")
  );
  sc.ScaleInfo.register(
	"superLocrian",
    new Scale([0,1,3,4,6,8,10], 12, "Super Locrian")
  );
  sc.ScaleInfo.register(
    "romanianMinor",
    new Scale([0,2,3,6,7,9,10], 12, "Romanian Minor")
  );
  sc.ScaleInfo.register(
    "hungarianMinor",
    new Scale([0,2,3,6,7,8,11], 12, "Hungarian Minor")
  );
  sc.ScaleInfo.register(
    "neapolitanMinor",
    new Scale([0,1,3,5,7,8,11], 12, "Neapolitan Minor")
  );
  sc.ScaleInfo.register(
    "enigmatic",
    new Scale([0,1,4,6,8,10,11], 12, "Enigmatic")
  );
  sc.ScaleInfo.register(
    "spanish",
    new Scale([0,1,4,5,7,8,10], 12, "Spanish")
  );
  // ### modes of whole tones with added note ->
  sc.ScaleInfo.register(
	"leadingWhole",
    new Scale([0,2,4,6,8,10,11], 12, "Leading Whole Tone")
  );
  sc.ScaleInfo.register(
    "lydianMinor",
    new Scale([0,2,4,6,7,8,10], 12, "Lydian Minor")
  );
  sc.ScaleInfo.register(
    "neapolitanMajor",
    new Scale([0,1,3,5,7,9,11], 12, "Neapolitan Major")
  );
  sc.ScaleInfo.register(
    "locrianMajor",
    new Scale([0,2,4,5,6,8,10], 12, "Locrian Major")
  );
  // ### 8 note scales
  sc.ScaleInfo.register(
    "diminished",
    new Scale([0,1,3,4,6,7,9,10], 12, "Diminished")
  );
  sc.ScaleInfo.register(
    "diminished2",
    new Scale([0,2,3,5,6,8,9,11], 12, "Diminished 2")
  );
  // ### 12 note scales
  sc.ScaleInfo.register(
    "chromatic",
    new Scale([0,1,2,3,4,5,6,7,8,9,10,11], 12, "Chromatic")
  );
  // ### TWENTY-FOUR TONES PER OCTAVE
  sc.ScaleInfo.register(
    "chromatic24",
    new Scale([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], 24, "Chromatic 24")
  );
  // ### maqam ajam
  sc.ScaleInfo.register(
    "ajam",
    new Scale([0,4,8,10,14,18,22], 24, "Ajam")
  );
  sc.ScaleInfo.register(
    "jiharkah",
    new Scale([0,4,8,10,14,18,21], 24, "Jiharkah")
  );
  sc.ScaleInfo.register(
    "shawqAfza",
    new Scale([0,4,8,10,14,16,22], 24, "Shawq Afza")
  );
  // ### maqam sikah
  sc.ScaleInfo.register(
    "sikah",
    new Scale([0,3,7,11,14,17,21], 24, "Sikah")
  );
  sc.ScaleInfo.register(
    "sikahDesc",
    new Scale([0,3,7,11,13,17,21], 24, "Sikah Descending")
  );
  sc.ScaleInfo.register(
    "huzam",
    new Scale([0,3,7,9,15,17,21], 24, "Huzam")
  );
  sc.ScaleInfo.register(
    "iraq",
    new Scale([0,3,7,10,13,17,21], 24, "Iraq")
  );
  sc.ScaleInfo.register(
    "bastanikar",
    new Scale([0,3,7,10,13,15,21], 24, "Bastanikar")
  );
  sc.ScaleInfo.register(
    "mustar",
    new Scale([0,5,7,11,13,17,21], 24, "Mustar")
  );
  // ### maqam bayati
  sc.ScaleInfo.register(
    "bayati",
    new Scale([0,3,6,10,14,16,20], 24, "Bayati")
  );
  sc.ScaleInfo.register(
    "karjighar",
    new Scale([0,3,6,10,12,18,20], 24, "Karjighar")
  );
  sc.ScaleInfo.register(
    "husseini",
    new Scale([0,3,6,10,14,17,21], 24, "Husseini")
  );
  // ### maqam nahawand
  sc.ScaleInfo.register(
    "nahawand",
    new Scale([0,4,6,10,14,16,22], 24, "Nahawand")
  );
  sc.ScaleInfo.register(
    "nahawandDesc",
    new Scale([0,4,6,10,14,16,20], 24, "Nahawand Descending")
  );
  sc.ScaleInfo.register(
    "farahfaza",
    new Scale([0,4,6,10,14,16,20], 24, "Farahfaza")
  );
  sc.ScaleInfo.register(
    "murassah",
    new Scale([0,4,6,10,12,18,20], 24, "Murassah")
  );
  sc.ScaleInfo.register(
    "ushaqMashri",
    new Scale([0,4,6,10,14,17,21], 24, "Ushaq Mashri")
  );
  // ### maqam rast
  sc.ScaleInfo.register(
    "rast",
    new Scale([0,4,7,10,14,18,21], 24, "Rast")
  );
  sc.ScaleInfo.register(
    "rastDesc",
    new Scale([0,4,7,10,14,18,20], 24, "Rast Descending")
  );
  sc.ScaleInfo.register(
    "suznak",
    new Scale([0,4,7,10,14,16,22], 24, "Suznak")
  );
  sc.ScaleInfo.register(
    "nairuz",
    new Scale([0,4,7,10,14,17,20], 24, "Nairuz")
  );
  sc.ScaleInfo.register(
    "yakah",
    new Scale([0,4,7,10,14,18,21], 24, "Yakah")
  );
  sc.ScaleInfo.register(
    "yakahDesc",
    new Scale([0,4,7,10,14,18,20], 24, "Yakah Descending")
  );
  sc.ScaleInfo.register(
    "mahur",
    new Scale([0,4,7,10,14,18,22], 24, "Mahur")
  );
  // ### maqam hijaz
  sc.ScaleInfo.register(
    "hijaz",
    new Scale([0,2,8,10,14,17,20], 24, "Hijaz")
  );
  sc.ScaleInfo.register(
    "hijazDesc",
    new Scale([0,2,8,10,14,16,20], 24, "Hijaz Descending")
  );
  sc.ScaleInfo.register(
    "zanjaran",
    new Scale([0,2,8,10,14,18,20], 24, "Zanjaran")
  );
  // ### maqam saba
  sc.ScaleInfo.register(
	"saba",
    new Scale([0,3,6,8,12,16,20], 24, "Saba")
  );
  sc.ScaleInfo.register(
    "zamzam",
    new Scale([0,2,6,8,14,16,20], 24, "Zamzam")
  );
  // ### maqam kurd
  sc.ScaleInfo.register(
    "kurd",
    new Scale([0,2,6,10,14,16,20], 24, "Kurd")
  );
  sc.ScaleInfo.register(
    "kijazKarKurd",
    new Scale([0,2,8,10,14,16,22], 24, "Kijaz Kar Kurd")
  );
  // ### maqam nawa Athar
  sc.ScaleInfo.register(
    "nawaAthar",
    new Scale([0,4,6,12,14,16,22], 24, "Nawa Athar")
  );
  sc.ScaleInfo.register(
    "nikriz",
    new Scale([0,4,6,12,14,18,20], 24, "Nikriz")
  );
  sc.ScaleInfo.register(
    "atharKurd",
    new Scale([0,2,6,12,14,16,22], 24, "Athar Kurd")
  );

  sc.Scale = Scale;

})(sc);
