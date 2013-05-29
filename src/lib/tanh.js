/**
 * Hyperbolic tangent
 * @arguments _none_
 */
sc.define("tanh", {
  Number: function() {
    return this.sinh() / this.cosh();
  },
  Array: function() {
    return this.map(function(x) { return x.tanh(); });
  }
});
