/**
 * Base e logarithm.
 * @arguments _none_
 */
sc.define("log", {
  Number: function() {
    return Math.log(this);
  },
  Array: function() {
    return this.map(function(x) { return x.log(); });
  }
});
