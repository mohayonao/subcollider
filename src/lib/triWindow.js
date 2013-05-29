/**
 * a value for a triangle window function between 0 and 1.
 * @arguments _none_
 */
sc.define("triWindow", {
  Number: function() {
    if (this < 0 || this > 1) { return 0; }
    return (this < 0.5) ? 2 * this : -2 * this + 2;
  },
  Array: function() {
    return this.map(function(x) { return x.triWindow(); });
  }
});
