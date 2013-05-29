/**
 * Truncate to multiple of aNumber
 * @arguments _(number)_
 */
sc.define("trunc", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.trunc(num); }, this);
    }
    return num === 0 ? this : Math.floor(this / num) * num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.trunc(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.trunc(num); });
    }
  }
});
