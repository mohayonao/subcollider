/**
 * negation
 * @arguments _none_
 */
sc.define("neg", {
  Number: function() {
    return -this;
  },
  Array: function() {
    return this.map(function(x) { return x.neg(); });
  }
});
