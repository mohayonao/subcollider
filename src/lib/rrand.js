/**
 * a random number in the interval ]a, b[.
 * @arguments _(number)_
 */
sc.define("rrand", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.rrand(num); }, this);
    }
    return this > num ?
      Math.random() * (num - this) + this :
      Math.random() * (this - num) + num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.rrand(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.rrand(num); });
    }
  }
});
