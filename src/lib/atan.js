/**
 * Arctangent
 * @arguments _none_
 */
sc.define("atan", {
  Number: function() {
    return Math.atan(this);
  },
  Array: function() {
    return this.map(function(x) { return x.atan(); });
  }
});
