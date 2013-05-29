/**
 * Base 2 logarithm.
 * @arguments _none_
 */
sc.define("log2", {
  Number: function() {
    return Math.log(Math.abs(this)) * Math.LOG2E;
  },
  Array: function() {
    return this.map(function(x) { return x.log2(); });
  }
});
