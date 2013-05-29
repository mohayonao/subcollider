/**
 * e to the power of the receiver.
 * @arguments _none_
 */
sc.define("exp", {
  Number: function() {
    return Math.exp(this);
  },
  Array: function() {
    return this.map(function(x) { return x.exp(); });
  }
});
