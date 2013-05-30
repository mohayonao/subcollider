/**
 * performs a binary right shift
 * @arguments _(number)_
 */
sc.define(["rightShift", ">>"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.rightShift(num); }, this);
    }
    return this >> num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.rightShift(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.rightShift(num); });
    }
  }
});
