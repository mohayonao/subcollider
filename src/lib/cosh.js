/**
 * Hyperbolic cosine
 * @arguments _none_
 */
sc.define("cosh", {
  Number: function() {
    return (Math.pow(Math.E, this) + Math.pow(Math.E, -this)) * 0.5;
  },
  Array: function() {
    return this.map(function(x) { return x.cosh(); });
  }
});
