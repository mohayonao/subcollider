/**
 * the cube of the number
 * @arguments _none_
 */
sc.define("cubed", {
  Number: function() {
    return this * this * this;
  },
  Array: function() {
    return this.map(function(x) { return x.cubed(); });
  }
});
