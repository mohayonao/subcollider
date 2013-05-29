/**
 * the square of the number
 * @arguments _none_
 */
sc.define("squared", {
  Number: function() {
    return this * this;
  },
  Array: function() {
    return this.map(function(x) { return x.squared(); });
  }
});
