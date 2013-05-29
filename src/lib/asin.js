/**
 * Arcsine
 * @arguments _none_
 */
sc.define("asin", {
  Number: function() {
    return Math.asin(this);
  },
  Array: function() {
    return this.map(function(x) { return x.asin(); });
  }
});
