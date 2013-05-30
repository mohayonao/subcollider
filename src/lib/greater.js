/**
 * greater than
 * @arguments _(number)_
 */
sc.define(["greater", ">"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.greater(num); }, this);
    }
    return this > num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.greater(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.greater(num); });
    }
  }
});
