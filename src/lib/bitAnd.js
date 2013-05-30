/**
 * performs a bitwise and with aNumber
 * @arguments _(number)_
 */
sc.define(["bitAnd", "&"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.bitAnd(num); }, this);
    }
    return this & num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.bitAnd(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.bitAnd(num); });
    }
  }
});
