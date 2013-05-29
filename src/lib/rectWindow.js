/**
 * a value for a rectangular window function between 0 and 1.
 * @arguments _none_
 */
sc.define("rectWindow", {
  Number: function() {
    if (this < 0 || this > 1) { return 0; }
    return 1;
  },
  Array: function() {
    return this.map(function(x) { return x.rectWindow(); });
  }
});
