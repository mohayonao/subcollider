/**
 * a nonlinear distortion function.
 * @arguments _none_
 * @example
 *   (1).distort(); // => 0.5
 *   [0, 1, 5, 10].distort(); // => [ 0, 0.5, 0.8333, 0.9090 ]
 */
sc.define("distort", {
  Number: function() {
    return this / (1 + Math.abs(this));
  },
  Array: function() {
    return this.map(function(x) { return x.distort(); });
  }
});
