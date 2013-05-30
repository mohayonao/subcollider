(function(sc) {
  "use strict";

  /**
   * @name *Scale
   * @description
   * Scale supports arbitrary octave divisions and ratios, and (in conjunction with Tuning) can generate pitch information in various ways.
   * @example
   *  sc.Scale.major(); // => Major Scale
   *  sc.Scale.dorian("Pythagorean"); // => Dorian Scale with Pythagorean Tuning
   *  sc.ScaleInfo.names(); // list of scale name
   *  sc.ScaleInfo.at("minor"); // => Minor Scale
   */
  function Scale(degrees, pitchesPerOctave, tuning, name) {
    if (!(this instanceof Scale)) {
      return new Scale(degrees, pitchesPerOctave, tuning, name);
    }
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
  /**
   * @name *choose
   * @description
   * Creates a random scale from the library, constrained by size and pitchesPerOctave if desired
   * @arguments _([size=7, pitchesPerOctave=12])_
   * @example
   *  sc.Scale.choose(7);
   */
  Scale.choose = function(size, pitchesPerOctave) {
    if (sc.isArrayArgs(arguments)) {
      return [size, pitchesPerOctave].flop().map(function(items) {
        return Scale.choose(items[0], items[1]);
      });
    }
    if (typeof size !== "number") { size = 7; }
    if (typeof pitchesPerOctave !== "number") { pitchesPerOctave = 12; }
    return ScaleInfo.choose(function(x) {
      return x._degrees.length === size &&
        x._pitchesPerOctave === pitchesPerOctave;
    });
  };
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
  /**
   * @name tuning
   * @description
   * Sets or gets the tuning of the Scale.
   * @arguments _([inTuning])_
   * @example
   *  sc.Scale.major().tuning("just"); // set tuning
   *  sc.Scale.major().tuning(); // get tuning
   */
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
  /**
   * @name semitone
   * @description
   * Returns a tuned array of semitone values
   * @arguments _none_
   */
  Scale.prototype.semitones = function() {
    return this._degrees.map(this._tuning.wrapAt.bind(this._tuning));
  };
  /**
   * @name cents
   * @description
   * Returns a turned array of cent values
   * @arguments _none_
   */
  Scale.prototype.cents = function() {
    return this.semitones().map(function(x) {
      return x * 100;
    });
  };
  /**
   * @name ratios
   * @description
   * Return a turned array of ratios
   * @arguments _none_
   */
  Scale.prototype.ratios = function() {
    return this._ratios;
  };
  /**
   * @name size
   * @description
   * Returns the length of the scale.
   * @arguments _none_
   * @example
   *  sc.Scale.ionian().size(); // 7
   *  sc.Scale.minorPentatonic().size(); // 5
   */
  Scale.prototype.size = function() {
    return this._degrees.length;
  };
  /**
   * @name pitchesPerOctave
   * @description
   * Returns the size of the pitch class set from which the tuning is drawn
   * @arguments _none_
   * @example
   *  sc.Scale.aeolian().pitchesPerOctave(); // 12
   *  sc.Scale.ajam().pitchesPerOctave(); // 24 (this is a quarter-tone scale)
   */
  Scale.prototype.pitchesPerOctave = function() {
    return this._pitchesPerOctave;
  };
  /**
   * @name stepsPerOctave
   * @description
   * Usually 12, but may be different if the current tuning has a stretched or compressed octave. Needed for degreeToKey
   * @arguments _none_
   */
  Scale.prototype.stepsPerOctave = function() {
    return Math.log(this.octaveRatio()) * Math.LOG2E * 12;
  };
  /**
   * @name at
   * @arguments _(index)_
   */
  Scale.prototype.at = function(index) {
    return this._tuning.at(this._degrees.wrapAt(index));
  };
  /**
   * @name wrapAt
   * @description
   * These access the array generated by semitones.
   * @arguments _(index)_
   * @example
   *  a = sc.Scale.major();
   *  a.wrapAt(4); // =>  7
   *  a.wrapAt([5, 6, 7]); // => [ 9, 11, 0 ]
   */
  Scale.prototype.wrapAt = function(index) {
    return this._tuning.wrapAt(this._degrees.wrapAt(index));
  };
  /**
   * @name degreeToFreq
   * @description
   * Returns a frequency based on current tuning and rootFreq argument.
   * @argument _(degree, rootFreq, octave)_
   * @example
   *  sc.Scale.major().degreeToFreq(2, (60).midicps(), 1); // => 659.25511...
   *  sc.Scale.major("just").degreeToFreq(2, (60).midicps(), 1); // => 654.06391...
   */
  Scale.prototype.degreeToFreq = function(degree, rootFreq, octave) {
    return this.degreeToRatio(degree, octave).opMul(rootFreq);
  };
  /**
   * @name degreeToRatio
   * @description
   * Returns a ratio based on current tuning.
   * @arguments _(degree [, octave=0])_
   * @example
   *  sc.Scale.major().degreeToRatio(2, 1).round(0.001); // => 2.52
   *  sc.Scale.major("just").degreeToRatio(2, 1).round(0.001); // => 2.5
   */
  Scale.prototype.degreeToRatio = function(degree, octave) {
    if (sc.isArrayArgs(arguments)) {
      return [degree, octave].flop().map(function(items) {
        return this.degreeToRatio(items[0], items[1]);
      }, this);
    }
    octave = octave === void 0 ? 0 : octave;
    octave += (degree / this._degrees.length)|0;
    return this.ratios().wrapAt(degree).opMul(this.octaveRatio().pow(octave));
  };
  /**
   * @name degreeToFreq2
   * @description
   * Same `degreeToFreq`, but use `blendAt`.
   * @argument _(degree, rootFreq, octave)_
   * @example
   *  sc.Scale.major().degreeToFreq2(2.5, (60).midicps(), 1); // => 678.8557...
   *  sc.Scale.major("just").degreeToFreq2(2.5, (60).midicps(), 1); // => 675.8660...
   */
  Scale.prototype.degreeToFreq2 = function(degree, rootFreq, octave) {
    return this.degreeToRatio2(degree, octave).opMul(rootFreq);
  };
  /**
   * @name degreeToRatio2
   * @description
   * Same as `degreeToRatio`, but use `blendAt`.
   * @arguments _(degree [, octave=0])_
   * @example
   *  sc.Scale.major().degreeToRatio2(2.5, 1).round(0.001); // => 2.595
   *  sc.Scale.major("just").degreeToRatio2(2.5, 1).round(0.001); // => 2.583
   */
  Scale.prototype.degreeToRatio2 = function(degree, octave) {
    if (sc.isArrayArgs(arguments)) {
      return [degree, octave].flop().map(function(items) {
        return this.degreeToRatio2(items[0], items[1]);
      }, this);
    }
    octave = octave === void 0 ? 0 : octave;
    octave += (degree / this._degrees.length)|0;
    var _index = degree.opMod(this._degrees.length);
    return this.ratios().blendAt(_index).opMul(this.octaveRatio().pow(octave));
  };
  Scale.prototype.checkTuningForMismatch = function(aTuning) {
    return this._pitchesPerOctave === aTuning.size();
  };
  /**
   * @name degrees
   * @arguments _none_
   */
  Scale.prototype.degrees = function() {
    return this._degrees;
  };
  Scale.prototype.guessPPO = function() {
    return Scale.guessPPO(this._degrees);
  };
  /**
   * @name octaveRatio
   * @arguments _none_
   */
  Scale.prototype.octaveRatio = function() {
    return this._tuning.octaveRatio();
  };
  /**
   * @name performDegreeToKey
   * @arguments _(scaleDegree, stepsPerOctave [, accidental=0])_
   */
  Scale.prototype.performDegreeToKey = function(scaleDegree, stepsPerOctave, accidental) {
    if (sc.isArrayArgs(arguments)) {
      return [scaleDegree, stepsPerOctave, accidental].flop().map(function(items) {
        return this.performDegreeToKey(items[0], items[1], items[2]);
      }, this);
    }
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
  /**
   * @name performKeyToDegree
   * @arguments _(degree [, stepsPerOctave=12])_
   */
  Scale.prototype.performKeyToDegree = function(degree, stepsPerOctave) {
    if (sc.isArrayArgs(arguments)) {
      return [degree, stepsPerOctave].flop().map(function(items) {
        return this.performKeyToDegree(items[0], items[1]);
      }, this);
    }
    if (typeof stepsPerOctave !== "number") { stepsPerOctave = 12; }
    return this._degrees.performKeyToDegree(degree, stepsPerOctave);
  };
  /**
   * @name performNearestInList
   * @arguments _(degree)_
   */
  Scale.prototype.performNearestInList = function(degree) {
    return this._degrees.performNearestInList(degree);
  };
  /**
   * @name performNearestInScale
   * @arguments _(degree [, stepsPerOctave=12])_
   */
  Scale.prototype.performNearestInScale = function(degree, stepsPerOctave) {
    if (sc.isArrayArgs(arguments)) {
      return [degree, stepsPerOctave].flop().map(function(items) {
        return this.performNearestInScale(items[0], items[1]);
      }, this);
    }
    if (typeof stepsPerOctave !== "number") { stepsPerOctave = 12; }
    return this._degrees.performNearestInScale(degree, stepsPerOctave);
  };
  Scale.prototype.equals = function(argScale) {
    return this.degrees().equals(argScale.degrees()) && this._tuning.equals(argScale._tuning);
  };
  Scale.prototype.deepCopy = function() {
    return Scale(this._degrees.slice(),
                 this._pitchesPerOctave,
                 this._tuning.deepCopy(),
                 this.name);
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
    "major", Scale([0,2,4,5,7,9,11], 12, null, "Major")
  );
  ScaleInfo.register(
    "minor", Scale([0,2,3,5,7,8,10], 12, null, "Natural Minor")
  );
  // ### TWELVE-TONES PER OCTAVE

  // ### 5 note scales
  sc.ScaleInfo.register(
    "minorPentatonic",
    Scale([0,3,5,7,10], 12, "Minor Pentatonic")
  );
  sc.ScaleInfo.register(
    "majorPentatonic",
    Scale([0,2,4,7,9], 12, "Major Pentatonic")
  );
  // ### another mode of major pentatonic
  sc.ScaleInfo.register(
    "ritusen",
    Scale([0,2,5,7,9], 12, "Ritusen")
  );
  // ### another mode of major pentatonic
  sc.ScaleInfo.register(
    "egyptian",
    Scale([0,2,5,7,10], 12, "Egyptian")
  );
  sc.ScaleInfo.register(
	"kumoi",
    Scale([0,2,3,7,9], 12, "Kumoi")
  );
  sc.ScaleInfo.register(
	"hirajoshi",
    Scale([0,2,3,7,8], 12, "Hirajoshi")
  );
  sc.ScaleInfo.register(
	"iwato",
    Scale([0,1,5,6,10], 12, "Iwato")
  );
  sc.ScaleInfo.register(
	"ryukyu",
    Scale([0,4,5,7,11], 12, "Ryukyu")
  );
  sc.ScaleInfo.register(
	"chinese",
    Scale([0,4,6,7,11], 12, "Chinese")
  );
  sc.ScaleInfo.register(
	"indian",
    Scale([0,4,5,7,10], 12, "Indian")
  );
  sc.ScaleInfo.register(
	"pelog",
    Scale([0,1,3,7,8], 12, "Pelog")
  );
  sc.ScaleInfo.register(
	"prometheus",
    Scale([0,2,4,6,11], 12, "Prometheus")
  );
  sc.ScaleInfo.register(
	"scriabin",
    Scale([0,1,4,7,9], 12, "Scriabin")
  );
  // ### han chinese pentatonic scales
  sc.ScaleInfo.register(
	"gong",
    Scale([0,2,4,7,9], 12, "Gong")
  );
  sc.ScaleInfo.register(
	"shang",
    Scale([0,2,5,7,10], 12, "Shang")
  );
  sc.ScaleInfo.register(
    "jiao",
    Scale([0,3,5,8,10], 12, "Jiao")
  );
  sc.ScaleInfo.register(
    "zhi",
    Scale([0,2,5,7,9], 12, "Zhi")
  );
  sc.ScaleInfo.register(
    "yu",
    Scale([0,3,5,7,10], 12, "Yu")
  );
  // ### 6 note scales
  sc.ScaleInfo.register(
    "whole",
    Scale([0,2,4,6,8,10], 12, "Whole Tone")
  );
  sc.ScaleInfo.register(
	"augmented",
    Scale([0,3,4,7,8,11], 12, "Augmented")
  );
  sc.ScaleInfo.register(
	"augmented2",
    Scale([0,1,4,5,8,9], 12, "Augmented 2")
  );
  // ### Partch's Otonalities and Utonalities
  sc.ScaleInfo.register(
    "partch_o1",
    Scale([0,8,14,20,25,34], 43, "partch", "Partch Otonality 1")
  );
  sc.ScaleInfo.register(
	"partch_o2",
    Scale([0,7,13,18,27,35], 43, "partch", "Partch Otonality 2")
  );
  sc.ScaleInfo.register(
    "partch_o3",
    Scale([0,6,12,21,29,36], 43, "partch", "Partch Otonality 3")
  );
  sc.ScaleInfo.register(
    "partch_o4",
    Scale([0,5,15,23,30,37], 43, "partch", "Partch Otonality 4")
  );
  sc.ScaleInfo.register(
    "partch_o5",
    Scale([0,10,18,25,31,38], 43, "partch", "Partch Otonality 5")
  );
  sc.ScaleInfo.register(
    "partch_o6",
    Scale([0,9,16,22,28,33], 43, "partch", "Partch Otonality 6")
  );
  sc.ScaleInfo.register(
    "partch_u1",
    Scale([0,9,18,23,29,35], 43, "partch", "Partch Utonality 1")
  );
  sc.ScaleInfo.register(
    "partch_u2",
    Scale([0,8,16,25,30,36], 43, "partch", "Partch Utonality 2")
  );
  sc.ScaleInfo.register(
    "partch_u3",
    Scale([0,7,14,22,31,37], 43, "partch", "Partch Utonality 3")
  );
  sc.ScaleInfo.register(
    "partch_u4",
    Scale([0,6,13,20,28,38], 43, "partch", "Partch Utonality 4")
  );
  sc.ScaleInfo.register(
    "partch_u5",
    Scale([0,5,12,18,25,33], 43, "partch", "Partch Utonality 5")
  );
  sc.ScaleInfo.register(
    "partch_u6",
    Scale([0,10,15,21,27,34], 43, "partch", "Partch Utonality 6")
  );
  // ### hexatonic modes with no tritone
  sc.ScaleInfo.register(
	"hexMajor7",
    Scale([0,2,4,7,9,11], 12, "Hex Major 7")
  );
  sc.ScaleInfo.register(
    "hexDorian",
    Scale([0,2,3,5,7,10], 12, "Hex Dorian")
  );
  sc.ScaleInfo.register(
    "hexPhrygian",
    Scale([0,1,3,5,8,10], 12, "Hex Phrygian")
  );
  sc.ScaleInfo.register(
    "hexSus",
    Scale([0,2,5,7,9,10], 12, "Hex Sus")
  );
  sc.ScaleInfo.register(
    "hexMajor6",
    Scale([0,2,4,5,7,9], 12, "Hex Major 6")
  );
  sc.ScaleInfo.register(
    "hexAeolian",
    Scale([0,3,5,7,8,10], 12, "Hex Aeolian")
  );
  // ### 7 note scales
  sc.ScaleInfo.register(
	"ionian",
    Scale([0,2,4,5,7,9,11], 12, "Ionian")
  );
  sc.ScaleInfo.register(
	"dorian",
    Scale([0,2,3,5,7,9,10], 12, "Dorian")
  );
  sc.ScaleInfo.register(
	"phrygian",
    Scale([0,1,3,5,7,8,10], 12, "Phrygian")
  );
  sc.ScaleInfo.register(
	"lydian",
    Scale([0,2,4,6,7,9,11], 12, "Lydian")
  );
  sc.ScaleInfo.register(
	"mixolydian",
    Scale([0,2,4,5,7,9,10], 12, "Mixolydian")
  );
  sc.ScaleInfo.register(
	"aeolian",
    Scale([0,2,3,5,7,8,10], 12, "Aeolian")
  );
  sc.ScaleInfo.register(
    "locrian",
    Scale([0,1,3,5,6,8,10], 12, "Locrian")
  );
  sc.ScaleInfo.register(
	"harmonicMinor",
    Scale([0,2,3,5,7,8,11], 12, "Harmonic Minor")
  );
  sc.ScaleInfo.register(
	"harmonicMajor",
    Scale([0,2,4,5,7,8,11], 12, "Harmonic Major")
  );
  sc.ScaleInfo.register(
	"melodicMinor",
    Scale([0,2,3,5,7,9,11], 12, "Melodic Minor")
  );
  sc.ScaleInfo.register(
    "melodicMinorDesc",
    Scale([0,2,3,5,7,8,10], 12, "Melodic Minor Descending")
  );
  sc.ScaleInfo.register(
    "melodicMajor",
    Scale([0,2,4,5,7,8,10], 12, "Melodic Major")
  );
  sc.ScaleInfo.register(
	"bartok",
    Scale([0,2,4,5,7,8,10], 12, "Bartok")
  );
  sc.ScaleInfo.register(
	"hindu",
    Scale([0,2,4,5,7,8,10], 12, "Hindu")
  );
  // ### raga modes
  sc.ScaleInfo.register(
    "todi",
    Scale([0,1,3,6,7,8,11], 12, "Todi")
  );
  sc.ScaleInfo.register(
    "purvi",
    Scale([0,1,4,6,7,8,11], 12, "Purvi")
  );
  sc.ScaleInfo.register(
    "marva",
    Scale([0,1,4,6,7,9,11], 12, "Marva")
  );
  sc.ScaleInfo.register(
    "bhairav",
    Scale([0,1,4,5,7,8,11], 12, "Bhairav")
  );
  sc.ScaleInfo.register(
    "ahirbhairav",
    Scale([0,1,4,5,7,9,10], 12, "Ahirbhairav")
  );
  sc.ScaleInfo.register(
	"superLocrian",
    Scale([0,1,3,4,6,8,10], 12, "Super Locrian")
  );
  sc.ScaleInfo.register(
    "romanianMinor",
    Scale([0,2,3,6,7,9,10], 12, "Romanian Minor")
  );
  sc.ScaleInfo.register(
    "hungarianMinor",
    Scale([0,2,3,6,7,8,11], 12, "Hungarian Minor")
  );
  sc.ScaleInfo.register(
    "neapolitanMinor",
    Scale([0,1,3,5,7,8,11], 12, "Neapolitan Minor")
  );
  sc.ScaleInfo.register(
    "enigmatic",
    Scale([0,1,4,6,8,10,11], 12, "Enigmatic")
  );
  sc.ScaleInfo.register(
    "spanish",
    Scale([0,1,4,5,7,8,10], 12, "Spanish")
  );
  // ### modes of whole tones with added note ->
  sc.ScaleInfo.register(
	"leadingWhole",
    Scale([0,2,4,6,8,10,11], 12, "Leading Whole Tone")
  );
  sc.ScaleInfo.register(
    "lydianMinor",
    Scale([0,2,4,6,7,8,10], 12, "Lydian Minor")
  );
  sc.ScaleInfo.register(
    "neapolitanMajor",
    Scale([0,1,3,5,7,9,11], 12, "Neapolitan Major")
  );
  sc.ScaleInfo.register(
    "locrianMajor",
    Scale([0,2,4,5,6,8,10], 12, "Locrian Major")
  );
  // ### 8 note scales
  sc.ScaleInfo.register(
    "diminished",
    Scale([0,1,3,4,6,7,9,10], 12, "Diminished")
  );
  sc.ScaleInfo.register(
    "diminished2",
    Scale([0,2,3,5,6,8,9,11], 12, "Diminished 2")
  );
  // ### 12 note scales
  sc.ScaleInfo.register(
    "chromatic",
    Scale([0,1,2,3,4,5,6,7,8,9,10,11], 12, "Chromatic")
  );
  // ### TWENTY-FOUR TONES PER OCTAVE
  sc.ScaleInfo.register(
    "chromatic24",
    Scale([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], 24, "Chromatic 24")
  );
  // ### maqam ajam
  sc.ScaleInfo.register(
    "ajam",
    Scale([0,4,8,10,14,18,22], 24, "Ajam")
  );
  sc.ScaleInfo.register(
    "jiharkah",
    Scale([0,4,8,10,14,18,21], 24, "Jiharkah")
  );
  sc.ScaleInfo.register(
    "shawqAfza",
    Scale([0,4,8,10,14,16,22], 24, "Shawq Afza")
  );
  // ### maqam sikah
  sc.ScaleInfo.register(
    "sikah",
    Scale([0,3,7,11,14,17,21], 24, "Sikah")
  );
  sc.ScaleInfo.register(
    "sikahDesc",
    Scale([0,3,7,11,13,17,21], 24, "Sikah Descending")
  );
  sc.ScaleInfo.register(
    "huzam",
    Scale([0,3,7,9,15,17,21], 24, "Huzam")
  );
  sc.ScaleInfo.register(
    "iraq",
    Scale([0,3,7,10,13,17,21], 24, "Iraq")
  );
  sc.ScaleInfo.register(
    "bastanikar",
    Scale([0,3,7,10,13,15,21], 24, "Bastanikar")
  );
  sc.ScaleInfo.register(
    "mustar",
    Scale([0,5,7,11,13,17,21], 24, "Mustar")
  );
  // ### maqam bayati
  sc.ScaleInfo.register(
    "bayati",
    Scale([0,3,6,10,14,16,20], 24, "Bayati")
  );
  sc.ScaleInfo.register(
    "karjighar",
    Scale([0,3,6,10,12,18,20], 24, "Karjighar")
  );
  sc.ScaleInfo.register(
    "husseini",
    Scale([0,3,6,10,14,17,21], 24, "Husseini")
  );
  // ### maqam nahawand
  sc.ScaleInfo.register(
    "nahawand",
    Scale([0,4,6,10,14,16,22], 24, "Nahawand")
  );
  sc.ScaleInfo.register(
    "nahawandDesc",
    Scale([0,4,6,10,14,16,20], 24, "Nahawand Descending")
  );
  sc.ScaleInfo.register(
    "farahfaza",
    Scale([0,4,6,10,14,16,20], 24, "Farahfaza")
  );
  sc.ScaleInfo.register(
    "murassah",
    Scale([0,4,6,10,12,18,20], 24, "Murassah")
  );
  sc.ScaleInfo.register(
    "ushaqMashri",
    Scale([0,4,6,10,14,17,21], 24, "Ushaq Mashri")
  );
  // ### maqam rast
  sc.ScaleInfo.register(
    "rast",
    Scale([0,4,7,10,14,18,21], 24, "Rast")
  );
  sc.ScaleInfo.register(
    "rastDesc",
    Scale([0,4,7,10,14,18,20], 24, "Rast Descending")
  );
  sc.ScaleInfo.register(
    "suznak",
    Scale([0,4,7,10,14,16,22], 24, "Suznak")
  );
  sc.ScaleInfo.register(
    "nairuz",
    Scale([0,4,7,10,14,17,20], 24, "Nairuz")
  );
  sc.ScaleInfo.register(
    "yakah",
    Scale([0,4,7,10,14,18,21], 24, "Yakah")
  );
  sc.ScaleInfo.register(
    "yakahDesc",
    Scale([0,4,7,10,14,18,20], 24, "Yakah Descending")
  );
  sc.ScaleInfo.register(
    "mahur",
    Scale([0,4,7,10,14,18,22], 24, "Mahur")
  );
  // ### maqam hijaz
  sc.ScaleInfo.register(
    "hijaz",
    Scale([0,2,8,10,14,17,20], 24, "Hijaz")
  );
  sc.ScaleInfo.register(
    "hijazDesc",
    Scale([0,2,8,10,14,16,20], 24, "Hijaz Descending")
  );
  sc.ScaleInfo.register(
    "zanjaran",
    Scale([0,2,8,10,14,18,20], 24, "Zanjaran")
  );
  // ### maqam saba
  sc.ScaleInfo.register(
	"saba",
    Scale([0,3,6,8,12,16,20], 24, "Saba")
  );
  sc.ScaleInfo.register(
    "zamzam",
    Scale([0,2,6,8,14,16,20], 24, "Zamzam")
  );
  // ### maqam kurd
  sc.ScaleInfo.register(
    "kurd",
    Scale([0,2,6,10,14,16,20], 24, "Kurd")
  );
  sc.ScaleInfo.register(
    "kijazKarKurd",
    Scale([0,2,8,10,14,16,22], 24, "Kijaz Kar Kurd")
  );
  // ### maqam nawa Athar
  sc.ScaleInfo.register(
    "nawaAthar",
    Scale([0,4,6,12,14,16,22], 24, "Nawa Athar")
  );
  sc.ScaleInfo.register(
    "nikriz",
    Scale([0,4,6,12,14,18,20], 24, "Nikriz")
  );
  sc.ScaleInfo.register(
    "atharKurd",
    Scale([0,2,6,12,14,16,22], 24, "Athar Kurd")
  );

  sc.Scale = Scale;

})(sc);
