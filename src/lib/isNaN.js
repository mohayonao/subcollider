/**
 * Checks if the receiver is `NaN`.
 */
sc.define("isNaN", {
  Number: function() {
    return isNaN(this);
  },
  Array: function() {
    return this.map(function(x) { return x.isNaN(); });
  }
});
