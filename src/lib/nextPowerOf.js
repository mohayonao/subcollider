/**
 * the next power of aNumber
 * @arguments _(base)_
 */
sc.define("nextPowerOf", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.nextPowerOf(num); }, this);
    }
    return Math.pow(num, Math.ceil(Math.log(this) / Math.log(num)));
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.nextPowerOf(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.nextPowerOf(num); });
    }
  }
});
