/**
 * (a * a *b)
 * @arguments _(number)_
 */
sc.define("ring3", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.ring3(num); }, this);
    }
    return this * this * +num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.ring3(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.ring3(num); });
    }
  }
});
