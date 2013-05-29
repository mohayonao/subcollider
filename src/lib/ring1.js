/**
 * (a * b) + a
 * @arguments _(number)_
 */
sc.define("ring1", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.ring1(num); }, this);
    }
    return this * num + this;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.ring1(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.ring1(num); });
    }
  }
});
