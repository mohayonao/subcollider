/**
 * inverse of degreeToKey.
 * @arguments _(scale [, stepsPerOctave=12])_
 * @example
 *  l = [0, 1, 5, 9, 11]; // pentatonic scale
 *  sc.Range("60..73").collect(function(i) { return i.keyToDegree(l); });
 *  // => [ 25, 26, 26.25, 26.5, 26.75, 27, 27.25, 27.5, 27.75, 28, 28.5, 29, 30, 31 ]
 */
sc.define("keyToDegree", {
  Number: function(scale, stepsPerOctave) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    return scale.performKeyToDegree(this, stepsPerOctave);
  },
  Array: function(scale, stepsPerOctave) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    return this.map(function(val) {
      return val.keyToDegree(scale, stepsPerOctave);
    });
  }
});
