/**
 * (a + b) ** 2
 * @arguments _(number)_
 */
sc.define("sqrsum", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.sqrsum(num); }, this);
    }
    var z = this + num;
    return z * z;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.sqrsum(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.sqrsum(num); });
    }
  }
});
