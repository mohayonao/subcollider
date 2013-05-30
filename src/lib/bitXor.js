/**
 * Bitwise Exclusive Or
 * @arguments _(number)_
 */
sc.define(["bitXor", "^"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.bitXor(num); }, this);
    }
    return this ^ num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.bitXor(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.bitXor(num); });
    }
  }
});
