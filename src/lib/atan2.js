/**
 * Arctangent of ( *this* / *number* )
 * @arguments _(number)_
 */
sc.define("atan2", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.atan2(num); }, this);
    }
    return Math.atan2(this, num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.atan2(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.atan2(num); });
    }
  }
});
