/**
 * Checks if the receiver is >= 0.
 */
sc.define("isPositive", {
  Number: function() {
    return this >= 0;
  },
  Array: function() {
    return this.map(function(x) { return x.isPositive(); });
  }
});
