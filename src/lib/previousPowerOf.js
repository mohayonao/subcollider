/**
 * the number relative to this that is the previous power of aNumber
 */
sc.define("previousPowerOf", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.previousPowerOf(num); }, this);
    }
    return Math.pow(num, Math.ceil(Math.log(this) / Math.log(num)) - 1);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.previousPowerOf(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.previousPowerOf(num); });
    }
  }
});
