/**
 * round up to a multiply of aNumber
 * @arguments _(number)_
 */
sc.define("roundUp", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.roundUp(num); }, this);
    }
    return num === 0 ? 0 : Math.ceil(this / num) * num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.roundUp(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.roundUp(num); });
    }
  }
});
