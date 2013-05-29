/**
 * Checks if the receiver is < 0.
 */
sc.define("isNegative", {
  Number: function() {
    return this < 0;
  },
  Array: function() {
    return this.map(function(x) { return x.isNegative(); });
  }
});
