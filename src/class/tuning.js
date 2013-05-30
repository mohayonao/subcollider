(function(sc) {
  "use strict";

  /**
   * @name *Tuning
   * @description
   * Represents a musical tuning (e.g. equal temperament, just intonation, etc.). Used in conjunction with `Scale` to generate pitch information.
   * @example
   *  sc.Tuning.et12(); // => equal temperament
   *  sc.TuningInfo.names(); // => list of tuning name
   *  sc.TuningInfo.at("just"); // => Limit Just Intonation
   */
  function Tuning(tuning, octaveRatio, name) {
    if (!(this instanceof Tuning)) {
      return new Tuning(tuning, octaveRatio, name);
    }
    if (!Array.isArray(tuning)) {
      tuning = [0,1,2,3,4,5,6,7,8,9,10,11];
    }
    if (typeof octaveRatio !== "number") {
      octaveRatio = 2;
    }
    if (typeof name !== "string") {
      name = "Unknown Tuning";
    }
    this._tuning      = tuning;
    this._octaveRatio = octaveRatio;
    this.name = name;
  }
  /**
   * @name *choose
   * @description
   * Creates a random tuning from the library, constrained by size (which defaults to 12)
   * @arguments _([size=12])_
   */
  Tuning.choose = function(size) {
    if (Array.isArray(size)) {
      return size.map(function(size) {
        return Tuning.choose(size);
      });
    }
    if (typeof size !== "number") {
      size = 12;
    }
    return TuningInfo.choose(
      function(x) { return x.size() === size; }
    );
  };
  Tuning.et = function(pitchesPerOctave) {
    if (typeof pitchesPerOctave !== "number") {
      pitchesPerOctave = 12;
    }
    return Tuning(Tuning.calcET(pitchesPerOctave),
                  2,
                  Tuning.etName(pitchesPerOctave));
  };
  Tuning["default"] = function(pitchesPerOctave) {
    return Tuning.et(pitchesPerOctave);
  };
  Tuning.calcET = function(pitchesPerOctave) {
    var a = new Array(pitchesPerOctave);
    for (var i = a.length; i--; ) {
      a[i] = i * (12 / pitchesPerOctave);
    }
    return a;
  };
  Tuning.etName = function(pitchesPerOctave) {
    return "ET" + pitchesPerOctave;
  };
  /**
   * @name semitones
   * @description
   * Returns an array of semitone values for the pitch set
   * @arguments _none_
   */
  Tuning.prototype.semitones = function() {
    return this._tuning.slice();
  };
  /**
   * @name cents
   * @description
   * Returns a array of cent values for the pitch set
   * @arguments _none_
   */
  Tuning.prototype.cents = function() {
    return this._tuning.slice().map(function(x) {
      return x * 100;
    });
  };
  /**
   * @name ratios
   * @description
   * Returns a tuned array of ratios for the pitch set
   * @arguments _none_
   */
  Tuning.prototype.ratios = function() {
    return this._tuning.midiratio();
  };
  /**
   * @name at
   * @arguments _(index)_
   */
  Tuning.prototype.at = function(index) {
    return this._tuning.at(index);
  };
  /**
   * @name wrapAt
   * @arguments _(index)_
   */
  Tuning.prototype.wrapAt = function(index) {
    return this._tuning.wrapAt(index);
  };
  /**
   * @name octaveRatio
   * @arguments _none_
   */
  Tuning.prototype.octaveRatio = function() {
    return this._octaveRatio;
  };
  /**
   * @name size
   * @arguments _none_
   */
  Tuning.prototype.size = function() {
    return this._tuning.length;
  };
  /**
   * @name stepsPerOctave
   * @arguments _none_
   */
  Tuning.prototype.stepsPerOctave = function() {
    return Math.log(this._octaveRatio) * Math.LOG2E * 12;
  };
  /**
   * @name tuning
   * @arguments _none_
   */
  Tuning.prototype.tuning = function() {
    return this._tuning;
  };
  /**
   * @name equals
   * @arguments _(that)_
   */
  Tuning.prototype.equals = function(that) {
    return this._octaveRatio === that._octaveRatio &&
      this._tuning.equals(that._tuning);
  };
  // ## deepCopy ()
  Tuning.prototype.deepCopy = function() {
    return Tuning(this._tuning.slice(0),
                  this._octaveRatio,
                  this.name);
  };

  // # TuningInfo
  var TuningInfo = sc.TuningInfo = {};
  var tunings    = {};

  // ## TuningInfo.choose (selectFunc)
  TuningInfo.choose = function(selectFunc) {
    var candidates = [];
    var keys = Object.keys(tunings);
    var t;
    for (var i = keys.length; i--; ) {
      t = tunings[keys[i]];
      if (typeof selectFunc !== "function" || selectFunc(t)) {
        candidates.push(t);
      }
    }
    t = candidates[(Math.random() * candidates.length)|0];
    if (t) {
      return t.deepCopy();
    }
  };
  // ## TuningInfo.at (key)
  TuningInfo.at = function(key) {
    var t = tunings[key];
    if (t) {
      return t.deepCopy();
    }
  };
  // ## TuningInfo.names ()
  TuningInfo.names = function() {
    var keys = Object.keys(tunings);
    keys.sort();
    return keys;
  };
  // ## TuningInfo.register (key, tuning)
  TuningInfo.register = function(key, tuning) {
    if (typeof key === "string" && tuning instanceof Tuning) {
      tunings[key] = tuning;
      Tuning[key] = (function(key) {
        return function() {
          return TuningInfo.at(key).deepCopy();
        };
      }(key));
    }
  };

  TuningInfo.register(
    "et12", Tuning(([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
    ]), 2, "ET12")
  );
  TuningInfo.register(
    "just", Tuning([
      1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8
    ].ratiomidi(), 2, "Limit Just Intonation")
  );
  // ### TWELVE-TONE TUNINGS
  sc.TuningInfo.register(
    "pythagorean",
    Tuning([ 1, 256/243, 9/8, 32/27, 81/64, 4/3, 729/512, 3/2, 128/81, 27/16, 16/9, 243/128 ].ratiomidi(), 2, "Pythagorean")
  );

  sc.TuningInfo.register(
    "sept1",
    Tuning([ 1, 16/15, 9/8, 6/5, 5/4, 4/3, 7/5, 3/2, 8/5, 5/3, 9/5, 15/8 ].ratiomidi(), 2, "Septimal Tritone Just Intonation")
  );

  sc.TuningInfo.register(
    "sept2",
    Tuning([ 1, 16/15, 9/8, 6/5, 5/4, 4/3, 7/5, 3/2, 8/5, 5/3, 7/4, 15/8 ].ratiomidi(), 2, "7-Limit Just Intonation")
  );

  sc.TuningInfo.register(
    "mean4",
    Tuning([ 0, 0.755, 1.93, 3.105, 3.86, 5.035, 5.79, 6.965, 7.72, 8.895, 10.07, 10.82 ], 2, "Meantone, 1/4 Syntonic Comma")
  );

  sc.TuningInfo.register(
    "mean5",
    Tuning([ 0, 0.804, 1.944, 3.084, 3.888, 5.028, 5.832, 6.972, 7.776, 8.916, 10.056, 10.86 ], 2, "Meantone, 1/5 Pythagorean Comma")
  );

  sc.TuningInfo.register(
    "mean6",
    Tuning([ 0, 0.86, 1.96, 3.06, 3.92, 5.02, 5.88, 6.98, 7.84, 8.94, 10.04, 10.9 ], 2, "Meantone, 1/6 Pythagorean Comma")
  );

  sc.TuningInfo.register(
    "kirnberger",
    Tuning([ 1, 256/243, Math.sqrt(5)/2, 32/27, 5/4, 4/3, 45/32, Math.pow(5, 0.25), 128/81, Math.pow(5, 0.75)/2, 16/9, 15/8 ].ratiomidi(), 2, "Kirnberger III")
  );

  sc.TuningInfo.register(
    "werckmeister",
    Tuning([ 0, 0.92, 1.93, 2.94, 3.915, 4.98, 5.9, 6.965, 7.93, 8.895, 9.96, 10.935 ], 2, "Werckmeister III")
  );

  sc.TuningInfo.register(
    "vallotti",
    Tuning([ 0, 0.94135, 1.9609, 2.98045, 3.92180, 5.01955, 5.9218, 6.98045, 7.9609, 8.94135, 10, 10.90225 ], 2, "Vallotti")
  );

  sc.TuningInfo.register(
    "young",
    Tuning([ 0, 0.9, 1.96, 2.94, 3.92, 4.98, 5.88, 6.98, 7.92, 8.94, 9.96, 10.9 ], 2, "Young")
  );

  sc.TuningInfo.register(
    "reinhard",
    Tuning([ 1, 14/13, 13/12, 16/13, 13/10, 18/13, 13/9, 20/13, 13/8, 22/13, 13/7, 208/105 ].ratiomidi(), 2, "Mayumi Reinhard")
  );

  sc.TuningInfo.register(
    "wcHarm",
    Tuning([ 1, 17/16, 9/8, 19/16, 5/4, 21/16, 11/8, 3/2, 13/8, 27/16, 7/4, 15/8 ].ratiomidi(), 2, "Wendy Carlos Harmonic")
  );

  sc.TuningInfo.register(
    "wcSJ",
    Tuning([ 1, 17/16, 9/8, 6/5, 5/4, 4/3, 11/8, 3/2, 13/8, 5/3, 7/4, 15/8 ].ratiomidi(), 2, "Wendy Carlos Super Just")
  );

  // ### MORE THAN TWELVE-TONE ET
  sc.TuningInfo.register(
    "et19",
    Tuning(sc.Range("0..18").opMul(12/19), 2, "ET19")
  );

  sc.TuningInfo.register(
    "et22",
    Tuning(sc.Range("0..21").opMul(12/22), 2, "ET22")
  );

  sc.TuningInfo.register(
    "et24",
    Tuning(sc.Range("0..23").opMul(12/24), 2, "ET24")
  );

  sc.TuningInfo.register(
    "et31",
    Tuning(sc.Range("0..30").opMul(12/31), 2, "ET31")
  );

  sc.TuningInfo.register(
    "et41",
    Tuning(sc.Range("0..40").opMul(12/41), 2, "ET41")
  );
  sc.TuningInfo.register(
    "et53",
    Tuning(sc.Range("0..53").opMul(12/53), 2, "ET53")
  );
  // ### NON-TWELVE-TONE JI
  sc.TuningInfo.register(
    "johnston",
    Tuning([ 1, 25/24, 135/128, 16/15, 10/9, 9/8, 75/64, 6/5, 5/4, 81/64, 32/25, 4/3, 27/20, 45/32, 36/25, 3/2, 25/16, 8/5, 5/3, 27/16, 225/128, 16/9, 9/5, 15/8, 48/25 ].ratiomidi(), 2, "Ben Johnston")
  );
  sc.TuningInfo.register(
    "partch",
    Tuning([ 1, 81/80, 33/32, 21/20, 16/15, 12/11, 11/10, 10/9, 9/8, 8/7, 7/6, 32/27, 6/5, 11/9, 5/4, 14/11, 9/7, 21/16, 4/3, 27/20, 11/8, 7/5, 10/7, 16/11, 40/27, 3/2, 32/21, 14/9, 11/7, 8/5, 18/11, 5/3, 27/16, 12/7, 7/4, 16/9, 9/5, 20/11, 11/6, 15/8, 40/21, 64/33, 160/81 ].ratiomidi(), 2, "Harry Partch")
  );
  sc.TuningInfo.register(
    "catler",
    Tuning([ 1, 33/32, 16/15, 9/8, 8/7, 7/6, 6/5, 128/105, 16/13, 5/4, 21/16, 4/3, 11/8, 45/32, 16/11, 3/2, 8/5, 13/8, 5/3, 27/16, 7/4, 16/9, 24/13, 15/8 ].ratiomidi(), 2, "Jon Catler")
  );
  sc.TuningInfo.register(
    "chalmers",
    Tuning([ 1, 21/20, 16/15, 9/8, 7/6, 6/5, 5/4, 21/16, 4/3, 7/5, 35/24, 3/2, 63/40, 8/5, 5/3, 7/4, 9/5, 28/15, 63/32 ].ratiomidi(), 2, "John Chalmers")
  );
  sc.TuningInfo.register(
    "harrison",
    Tuning([ 1, 16/15, 10/9, 8/7, 7/6, 6/5, 5/4, 4/3, 17/12, 3/2, 8/5, 5/3, 12/7, 7/4, 9/5, 15/8 ].ratiomidi(), 2, "Lou Harrison")
  );
  sc.TuningInfo.register(
    "sruti",
    Tuning([ 1, 256/243, 16/15, 10/9, 9/8, 32/27, 6/5, 5/4, 81/64, 4/3, 27/20, 45/32, 729/512, 3/2, 128/81, 8/5, 5/3, 27/16, 16/9, 9/5, 15/8, 243/128 ].ratiomidi(), 2, "Sruti")
  );
  // ### HARMONIC SERIES -- length arbitary
  sc.TuningInfo.register(
    "harmonic",
    Tuning(sc.Range("1..24").ratiomidi(), 2, "Harmonic Series 24")
  );
  // ### STRETCHED/SHRUNK OCTAVE
  // ### Bohlen-Pierce
  sc.TuningInfo.register(
    "bp",
    Tuning(sc.Range("0..12").opMul((3).ratiomidi() / 13), 3.0, "Bohlen-Pierce")
  );
  sc.TuningInfo.register(
    "wcAlpha",
    Tuning(sc.Range("0..14").opMul(0.78), (15 * 0.78).midiratio(), "Wendy Carlos Alpha")
  );
  sc.TuningInfo.register(
    "wcBeta",
    Tuning(sc.Range("0..18").opMul(0.638), (19 * 0.638).midiratio(), "Wendy Carlos Beta")
  );
  sc.TuningInfo.register(
    "wcGamma",
    Tuning(sc.Range("0..33").opMul(0.351), (34 * 0.351).midiratio(), "Wendy Carlos Gamma")
  );

  sc.Tuning = Tuning;

})(sc);
