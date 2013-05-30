/**
 * performs an unsigned right shift
 * @arguments _(number)_
 */
sc.define(["unsignedRightShift", ">>>"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.unsignedRightShift(num); }, this);
    }
    return this >>> num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.unsignedRightShift(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.unsignedRightShift(num); });
    }
  }
});
