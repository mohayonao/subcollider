/**
 * less than
 * @arguments _(number)_
 */
sc.define(["less", "<"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.less(num); }, this);
    }
    return this < num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.less(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.less(num); });
    }
  }
});
