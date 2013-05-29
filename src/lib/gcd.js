/**
 * Greatest common divisor
 * @arguments _(number)_
 * @example
 *  [3, 6, 9, 12, 15].gcd(100); // => [ 1, 2, 1, 4, 5 ]
 */
sc.define("gcd", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.gcd(num); }, this);
    }
    var t, a =this|0, b=num|0;
    while (b !== 0) {
      t = a % b;
      a = b;
      b = t;
    }
    return a;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.gcd(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.gcd(num); });
    }
  }
});
