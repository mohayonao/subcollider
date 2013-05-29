/**
 * Round to multiple of aNumber
 * @arguments _(number)_
 */
sc.define("round", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.round(num); }, this);
    }
    return num === 0 ? 0 : Math.round(this / num) * num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.round(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.round(num); });
    }
  }
});
