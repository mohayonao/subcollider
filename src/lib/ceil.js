/**
 * next larger integer.
 * @arguments _none_
 */
sc.define("ceil", {
  Number: function() {
    return Math.ceil(this);
  },
  Array: function() {
    return this.map(function(x) { return x.ceil(); });
  }
});
