/**
 * true if not dividable by 2 with no rest
 * @arguments _none_
 */
sc.define("odd", {
  Number: function() {
    return (this & 1) === 1;
  },
  Array: function() {
    return this.map(function(x) { return x.odd(); });
  }
});
