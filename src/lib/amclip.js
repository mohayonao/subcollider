/**
 * 0 when b <= 0, a*b when b > 0
 * @arguments _(number)_
 */
sc.define("amclip", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.amclip(num); }, this);
    }
    return this * 0.5 * (num + Math.abs(num));
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.amclip(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.amclip(num); });
    }
  }
});
