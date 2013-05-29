/**
 * Sine
 * @arguments _none_
 */
sc.define("sin", {
  Number: function() {
    return Math.sin(this);
  },
  Array: function() {
    return this.map(function(x) { return x.sin(); });
  }
});
