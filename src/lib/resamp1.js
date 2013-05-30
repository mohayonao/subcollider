/**
 * Returns a new Array of the desired length, with values resampled evenly-spaced from the receiver with linear interpolation.
 * @arguments _(newSize)_
 * @example
 *  [1, 2, 3, 4].resamp1(12); // => [ 1, 1.2727, 1.5454, ... , 3.7272, 4 ]
 *  [1, 2, 3, 4].resamp1( 3); // => [ 1, 2.5, 4 ]
 */
sc.define("resamp1", {
  Array: function(newSize) {
    var factor = (this.length - 1) / (newSize - 1);
    var a = new Array(newSize);
    for (var i = 0; i < newSize; ++i) {
      a[i] = this.blendAt(i * factor);
    }
    return a;
  }
});
