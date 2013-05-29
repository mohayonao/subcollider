/**
 * a value for a welsh window function between 0 and 1.
 * @arguments _none_
 */
sc.define("welWindow", {
  Number: function() {
    if (this < 0 || this > 1) { return 0; }
    return Math.sin(this * Math.PI);
  },
  Array: function() {
    return this.map(function(x) { return x.welWindow(); });
  }
});
