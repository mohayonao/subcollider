/**
 * ((a * a * b) - (a * b * b))
 * @arguments _(number)_
 */
sc.define("ring4", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.ring4(num); }, this);
    }
    return this * this * num - this * num * num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.ring4(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.ring4(num); });
    }
  }
});
