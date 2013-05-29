/**
 * Returns a new Array whose elements are interlaced sequences of the elements of the receiver's subcollections, up to size length. The receiver is unchanged.
 * @arguments _(size)_
 * @example
 *  [[1, 2, 3], [0]].lace(10); // => [ 1, 0, 2, 0, 3, 0, 1, 0, 2, 0 ]
 */
sc.define("lace", {
  Array: function(size) {
    size = Math.max(1, size|0);
    var a = new Array(size);
    var v, wrap = this.length;
    for (var i = 0; i < size; ++i) {
      v = this[i % wrap];
      a[i] = Array.isArray(v) ? v[ ((i/wrap)|0) % v.length ] : v;
    }
    return a;
  }
});
