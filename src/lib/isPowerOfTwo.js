/**
 * the whether the receiver is a power of two.
 */
sc.define("isPowerOfTwo", {
  Number: function() {
    var a = Math.log(this) / Math.log(2);
    var b = a|0;
    return a === b;
  },
  Array: function() {
    return this.map(function(x) { return x.isPowerOfTwo(); });
  }
});
