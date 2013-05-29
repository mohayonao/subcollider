/**
 * fractional part
 * @arguments _none_
 */
sc.define("frac", {
  Number: function() {
    var frac = this - Math.floor(this);
    return frac < 0 ? 1 + frac : frac;
  },
  Array: function() {
    return this.map(function(x) { return x.frac(); });
  }
});
