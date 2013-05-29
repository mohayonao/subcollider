/**
 * Answers a Boolean which is the result of a random test whose probability of success in a range from zero to one is this.
 * @arguments _none_
 */
sc.define("coin", {
  Number: function() {
    return Math.random() < this;
  },
  Array: function() {
    return this.map(function(x) { return x.coin(); });
  }
});
