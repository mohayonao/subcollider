/**
 * Similar to `find` but returns an array of all the indices at which the sequence is found.
 * @arguments _(sublist [, offset=0])_
 * @example
 *   [7, 8, 7, 6, 5, 6, 7, 6, 7, 8, 9].findAll([7, 6]); // => [ 2, 6 ]
 */
sc.define("findAll", {
  Array: function(sublist, offset) {
    if (!Array.isArray(sublist)) {
      return [];
    }
    offset = Math.max(0, offset|0);
    var a = [];
    for (var i = offset, imax = this.length; i < imax; ++i) {
      var b = true;
      for (var j = 0, jmax = sublist.length; j < jmax; ++j) {
        if (this[i + j] !== sublist[j]) {
          b = false;
          break;
        }
      }
      if (b) { a.push(i); }
    }
    return a;
  }
});
