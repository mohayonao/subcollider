/**
 * Cosine
 * @arguments _none_
 */
sc.define("cos", {
  Number: function() {
    return Math.cos(this);
  },
  Array: function() {
    return this.map(function(x) { return x.cos(); });
  }
});
