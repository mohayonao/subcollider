/**
 * true if dividable by 2 with no rest
 * @arguments _none_
 */
sc.define("even", {
  Number: function() {
    return (this & 1) === 0;
  },
  Array: function() {
    return this.map(function(x) { return x.even(); });
  }
});
