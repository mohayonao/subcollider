/**
 * the folded value, a bitwise or with aNumber
 * @arguments _(number)_
 */
sc.define("fold2", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.fold(num); }, this);
    }
    return this.fold(-num, +num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.fold2(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.fold2(num); });
    }
  }
});
