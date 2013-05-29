/**
 * Maximum
 * @arguments _(number)_
 */
sc.define("max", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.max(num); }, this);
    }
    return Math.max(this, num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.max(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.max(num); });
    }
  }
});
