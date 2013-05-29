/**
 * Fill a Array with random values in the range *minVal* to *maxVal*.
 * @arguments _(size [, minVal=0, maxVal=1])_
 * @example
 *  Array.rand(8, 1, 100);
 */
sc.define("*rand", {
  Array: function(size, minVal, maxVal) {
    minVal = minVal === void 0 ? 0 : minVal;
    maxVal = maxVal === void 0 ? 1 : maxVal;
    var a = new Array(size|0);
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = minVal.rrand(maxVal);
    }
    return a;
  }
});

/**
 * Random number from zero up to the receiver, exclusive.
 * @arguments _none_
 */
sc.define("rand", {
  Number: function() {
    return Math.random() * this;
  },
  Array: function() {
    return this.map(function(x) { return x.rand(); });
  }
});
