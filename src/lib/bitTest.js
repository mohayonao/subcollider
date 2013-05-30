/**
 * true if bit at index aNumber is set.
 * @arguments _(bit)_
 */
sc.define("bitTest", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.bitTest(num); }, this);
    }
    return !!(this & (1 << num));
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.bitTest(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.bitTest(num); });
    }
  }
});
