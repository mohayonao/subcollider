/**
 * Arccosine
 * @arguments _none_
 */
sc.define("acos", {
  Number: function() {
    return Math.acos(this);
  },
  Array: function() {
    return this.map(function(x) { return x.acos(); });
  }
});
