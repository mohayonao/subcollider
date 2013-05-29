/**
 * Return a new Array whose elements are repeated n times.
 * @arguments _(n)_
 * @example
 *  [1, 2, 3].stutter(2); // => [ 1, 1, 2, 2, 3, 3 ]
 */
sc.define("stutter", {
  Array: function(n) {
    n = n === void 0 ? 2 : Math.max(0, n|0);
    var a = new Array(this.length * n);
    for (var i = 0, j = 0, imax = this.length; i < imax; ++i) {
      for (var k = 0; k < n; ++k, ++j) {
        a[j] = this[i];
      }
    }
    return a;
  }
});
