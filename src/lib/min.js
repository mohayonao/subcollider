/**
 * Minumum
 * @arguments _(number)_
 */
sc.define("min", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.min(num); }, this);
    }
    return Math.min(this, num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.min(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.min(num); });
    }
  }
});
