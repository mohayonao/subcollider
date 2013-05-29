/**
 * This was suggested by Larry Polansky as a poor man's gaussian.
 * @arguments _none_
 */
sc.define("sum3rand", {
  Number: function() {
    return (Math.random() + Math.random() + Math.random() - 1.5) * 0.666666667 * this;
  },
  Array: function() {
    return this.map(function(x) { return x.sum3rand(); });
  }
});
