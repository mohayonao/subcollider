/**
 * Same as `wrapExtend` but the sequences "clip" (return their last element) rather than wrapping.
 * @arguments _(size)_
 * @example
 *  [ 1, 2, 3 ].clipExtend(9); // => [ 1, 2, 3, 3, 3, 3, 3, 3, 3 ]
 */
sc.define("clipExtend", {
  Array: function(size) {
    size = Math.max(0, size|0);
    if (this.length < size) {
      var a = new Array(size);
      for (var i = 0, imax = this.length; i< imax; ++i) {
        a[i] = this[i];
      }
      for (var b = a[i-1]; i < size; ++i) {
        a[i] = b;
      }
      return a;
    } else {
      return this.slice(0, size);
    }
  }
});
