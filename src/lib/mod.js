/**
 * Integer Modulo
 * @arguments _(number)_
 * @example
 *  (10).mod(3); // => 1
 *  [10,20,30].mod(3); // => [ 1, 2, 0 ]
 */
sc.define("mod", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.mod(num); }, this);
    }
    if (this <= 0) {
      return num + Math.floor(this % num);
    } else {
      return Math.floor(this % num);
    }
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.mod(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.mod(num); });
    }
  }
});
