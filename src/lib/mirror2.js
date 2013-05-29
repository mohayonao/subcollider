/**
 * Return a new Array which is the receiver concatenated with a reversal of itself. The center element is duplicated. The receiver is unchanged.
 * @arguments _none_
 * @example
 *  [1, 2, 3, 4].mirror2(); // => [1, 2, 3, 4, 4, 3, 2, 1]
 */
sc.define("mirror2", {
  Array: function() {
    var size = this.length * 2;
    if (size < 2) {
      return this.slice(0);
    }
    var i, j, imax, a = new Array(size);
    for (i = 0, imax = this.length; i < imax; ++i) {
      a[i] = this[i];
    }
    for (j = imax - 1, imax = size; i < imax; ++i, --j) {
      a[i] = this[j];
    }
    return a;
  }
});
