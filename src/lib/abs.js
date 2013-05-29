/**
 * absolute value
 * @arguments _none_
 * @example
 *  (-10).abs(); // => 10
 *  [ -2, -1, 0, 1, 2 ].abs(); // => [ 2, 1, 0, 1, 2 ]
 */
sc.define("abs", {
  Number: function() {
    return Math.abs(this);
  },
  Array: function() {
    return this.map(function(x) { return x.abs(); });
  }
});
