/**
 * Finds the starting index of a number of elements contained in the array.
 * @arguments _(sublist [, offset=0])_
 * @example
 *   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].find([4, 5, 6]); // => 4
 */
sc.define("find", {
  Array: function(sublist, offset) {
    if (!Array.isArray(sublist)) {
      return -1;
    }
    offset = Math.max(0, offset|0);
    for (var i = offset, imax = this.length; i < imax; ++i) {
      var b = true;
      for (var j = 0, jmax = sublist.length; j < jmax; j++) {
        if (this[i + j] !== sublist[j]) {
          b = false;
          break;
        }
      }
      if (b) { return i; }
    }
    return -1;
  }
});
