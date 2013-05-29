/**
 * Map receiver onto a ramp starting at 0.
 * @arguments _none_
 */
sc.define("ramp", {
  Number: function() {
    if (this <= 0) { return 0; }
    if (this >= 1) { return 1; }
    return this;
  },
  Array: function() {
    return this.map(function(x) { return x.ramp(); });
  }
});
