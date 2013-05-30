/**
 * Fill an Array with random values in the range *minVal* to *maxVal* with exponential distribution.
 * @arguments _(size [, minVal=0, maxVal=1])_
 * @example
 *  Array.exprand(8, 1, 100);
 */
sc.define("*exprand", {
  Array: function(size, minVal, maxVal) {
    minVal = minVal === void 0 ? 0 : minVal;
    maxVal = maxVal === void 0 ? 1 : maxVal;
    minVal = Math.max(1e-6, minVal);
    maxVal = Math.max(1e-6, maxVal);
    var a = new Array(size|0);
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = minVal.exprand(maxVal);
    }
    return a;
  }
});

/**
 * an exponentially distributed random number in the interval ]a, b[.
 * @arguments _(number)_
 */
sc.define("exprand", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.exprand(num); }, this);
    }
    return this > num ?
      num * Math.exp(Math.log(this / num) * Math.random()) :
      this * Math.exp(Math.log(num / this) * Math.random());
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.exprand(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.exprand(num); });
    }
  }
});
