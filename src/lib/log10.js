/**
 * Base 10 logarithm.
 * @arguments _none_
 */
sc.define("log10", {
  Number: function() {
    return Math.log(this) * Math.LOG10E;
  },
  Array: function() {
    return this.map(function(x) { return x.log10(); });
  }
});
