/**
 * Map receiver in the onto an S-curve.
 * @arguments _none_
 */
sc.define("scurve", {
  Number: function() {
    if (this <= 0) { return 0; }
    if (this >= 1) { return 1; }
    return this * this * (3 - 2 * this);
  },
  Array: function() {
    return this.map(function(x) { return x.scurve(); });
  }
});
