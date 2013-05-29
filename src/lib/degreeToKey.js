/**
 * @arguments _(scale [, stepsPerOctave=12])_
 */
sc.define("degreeToKey", {
  Number: function(scale, stepsPerOctave) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    var scaleDegree = this.round()|0;
    var accidental = (this - scaleDegree) * 10;
    return scale.performDegreeToKey(scaleDegree, stepsPerOctave, accidental);
  },
  Array: function(scale, stepsPerOctave) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    return this.map(function(scaleDegree) {
      return scaleDegree.degreeToKey(scale, stepsPerOctave);
    });
  }
});
