/**
 * Same as `wrapExtend` but the sequences fold back on the list elements.
 * @arguments _(size)_
 * @example
 *  [ 1, 2, 3 ].foldExtend(9); // => [ 1, 2, 3, 2, 1, 2, 3, 2, 1 ]
 */
sc.define("foldExtend", {
  Array: function(size) {
    size = Math.max(0, size|0);
    var a = new Array(size);
    for (var i = 0; i < size; ++i) {
      a[i] = this.foldAt(i);
    }
    return a;
  }
});
