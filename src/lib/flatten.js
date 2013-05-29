/**
 * Returns an array from which *numLevels* of nesting has been flattened.
 * @arguments _([numLevels=1])_
 * @example
 *  [[1, 2, 3], [[4, 5], [[6]]]].flatten(1); // => [ 1, 2, 3, [ 4, 5 ], [ [ 6 ] ] ]
 *  [[1, 2, 3], [[4, 5], [[6]]]].flatten(2); // => [ 1, 2, 3, 4, 5, [ 6 ] ]
 */
sc.define("flatten", {
  Array: function(numLevels) {
    var list, i, imax;
    numLevels = numLevels === void 0 ? 1 : numLevels|0;
    if (numLevels <= 0) { return this; }
    numLevels -= 1;
    list = [];
    for (i = 0, imax = this.length; i < imax; ++i) {
      if (Array.isArray(this[i])) {
        list = list.addAll(this[i].flatten(numLevels));
      } else {
        list.push(this[i]);
      }
    }
    return list;
  }
});
