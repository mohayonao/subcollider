/**
 * Returns a new Array of the desired length, with values resampled evenly-spaced from the receiver without interpolation.
 * @arguments _(newSize)_
 * @example
 *  [1, 2, 3, 4].resamp0(12); // => [ 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4 ]
 *  [1, 2, 3, 4].resamp0( 2); // => [ 1, 4 ]
 */
sc.define("resamp0", {
  Array: function(newSize) {
    var factor = (this.length - 1) / (newSize - 1);
    var a = new Array(newSize);
    for (var i = 0; i < newSize; ++i) {
      a[i] = this[Math.round(i * factor)];
    }
    return a;
  }
});
