/**
 * Return a new Array whose elements are in rotated order. The receiver is unchanged.
 * @arguments _(n)_
 * @example
 *  [1, 2, 3, 4].rotate( 1); // => [ 4, 1, 2, 3 ]
 *  [1, 2, 3, 4].rotate(-1); // => [ 2, 3, 4, 1 ]
 */
sc.define("rotate", {
  Array: function(n) {
    n = n === void 0 ? 1 : n|0;
    var a = new Array(this.length);
    var size = a.length;
    n %= size;
    if (n < 0) { n = size + n; }
    for (var i = 0, j = n; i < size; ++i) {
      a[j] = this[i];
      if (++j >= size) { j = 0; }
    }
    return a;
  }
});
