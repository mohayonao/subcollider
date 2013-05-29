/**
 * Return the set theoretical union of this and *that*.
 * @arguments _(that)_
 * @example
 *  [1, 2, 3].union([2, 3, 4, 5]); // => [ 1, 2, 3, 4, 5 ]
 */
sc.define("union", {
  Array: function(that) {
    var result = this.slice(), i, imax;
    for (i = 0, imax = that.length; i < imax; ++i) {
      if (result.indexOf(that[i]) === -1) {
        result.push(that[i]);
      }
    }
    return result;
  }
});
