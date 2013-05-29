/**
 * Return a new Array which is the receiver made into a palindrome. The receiver is unchanged.
 * @arguments _none_
 * @example
 *  [1, 2, 3, 4].mirror(); // => [1, 2, 3, 4, 3, 2, 1]
 */
sc.define("mirror", {
  Array: function() {
    var size = this.length * 2 - 1;
    if (size < 2) {
      return this.slice(0);
    }
    var i, j, imax, a = new Array(size);
    for (i = 0, imax = this.length; i < imax; ++i) {
      a[i] = this[i];
    }
    for (j = imax - 2, imax = size; i < imax; ++i, --j) {
      a[i] = this[j];
    }
    return a;
  }
});
