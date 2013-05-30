/**
 * the value in the collection closest to this, assuming an octave repeating table of note values.
 * @arguments _(scale [, stepsPerOctave=12])_
 * @example
 *  l = [0, 1, 5, 9, 11]; // pentatonic scale
 *  sc.Range("60, 61..76").collect(function(i) { return i.nearestInScale(l, 12); });
 *  // => [ 60, 61, 61, 65, 65, 65, 65, 69, 69, 69, 71, 71, 72, 73, 73, 77, 77 ]
 */
sc.define("nearestInScale", {
  Number: function(scale, stepsPerOctave) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    return scale.performNearestInScale(this, stepsPerOctave);
  },
  Array: function(scale, stepsPerOctave) {
    // collection is sorted
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    var root = this.trunc(stepsPerOctave);
    var key  = this.opMod(stepsPerOctave);
    return key.nearestInScale(scale).opAdd(root);
  }
});
