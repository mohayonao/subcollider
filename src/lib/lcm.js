/**
 * Least common multiple
 * @arguments _(number)_
 * @example
 *    [3, 6, 12, 24, 48].lcm(20); // => [ 60, 60, 60, 120, 240 ]
 */
sc.define("lcm", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.lcm(num); }, this);
    }
    return Math.abs(this * num) / this.gcd(num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.lcm(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.lcm(num); });
    }
  }
});
