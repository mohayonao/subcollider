/**
 * Fill an `Array` with the interpolated values between the *start* and *end* values.
 * @arguments _(size [, start=0, end=1])_
 * @example
 *  Array.interpolation(5, 3.2, 20.5); // => [3.2, 7.525, 11.850, 16.175, 20.5]
 */
sc.define("*interpolation", {
  Array: function(size, start, end) {
    start = start === void 0 ? 0 : start;
    end   = end   === void 0 ? 1 : end;
    if (size === 1) {
      return [start];
    }
    var a = new Array(size|0);
    var step = (end - start) / (size - 1);
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = start + (i * step);
    }
    return a;
  }
});
