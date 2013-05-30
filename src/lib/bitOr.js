/**
 * performs a bitwise or with aNumber
 * @arguments _(number)_
 */
sc.define(["bitOr", "|"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.bitOr(num); }, this);
    }
    return this | num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.bitOr(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.bitOr(num); });
    }
  }
});
