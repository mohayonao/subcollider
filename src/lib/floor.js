/**
 * next smaller integer
 * @arguments _none_
 */
sc.define("floor", {
  Number: function() {
    return Math.floor(this);
  },
  Array: function() {
    return this.map(function(x) { return x.floor(); });
  }
});
