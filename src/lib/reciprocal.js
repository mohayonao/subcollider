/**
 * 1 / this
 * @arguments _none_
 */
sc.define("reciprocal", {
  Number: function() {
    return 1 / this;
  },
  Array: function() {
    return this.map(function(x) { return x.reciprocal(); });
  }
});
