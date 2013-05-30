/**
 * performs a binary left shift
 * @arguments _(number)_
 */
sc.define(["leftShift", "<<"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.leftShift(num); }, this);
    }
    return this << num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.leftShift(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.leftShift(num); });
    }
  }
});
