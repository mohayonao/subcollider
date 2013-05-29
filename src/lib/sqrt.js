/**
 * the square root of the number.
 * @arguments _none_
 */
sc.define("sqrt", {
  Number: function() {
    return Math.sqrt(this);
  },
  Array: function() {
    return this.map(function(x) { return x.sqrt(); });
  }
});
