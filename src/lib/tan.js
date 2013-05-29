/**
 * Tangent
 * @arguments _none_
 */
sc.define("tan", {
  Number: function() {
    return Math.tan(this);
  },
  Array: function() {
    return this.map(function(x) { return x.tan(); });
  }
});
