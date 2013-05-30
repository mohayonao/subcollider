/**
 * Fill an Array with random values in the range *minVal* to *maxVal* with a linear distribution.
 * @arguments _(size [, minVal=0, maxVal=1])_
 * @example
 *  Array.linrand(8, 1, 100);
 */
sc.define("*linrand", {
  Array: function(size, minVal, maxVal) {
    minVal = minVal === void 0 ? 0 : minVal;
    maxVal = maxVal === void 0 ? 1 : maxVal;
    var a = new Array(size|0);
    var range = maxVal - minVal;
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = minVal + range.linrand();
    }
    return a;
  }
});

/**
 * @arguments _none_
 * @returns a linearly distributed random number from zero to this.
 * @example
 *  (10).linrand();
 */
sc.define("linrand", {
  Number: function() {
    return Math.min(Math.random(), Math.random()) * this;
  },
  Array: function() {
    return this.map(function(x) { return x.linrand(); });
  }
});
