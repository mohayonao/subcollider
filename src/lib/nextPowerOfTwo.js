/**
 * the number relative to this that is the next power of 2
 * @arguments _none_
 */
sc.define("nextPowerOfTwo", {
  Number: function() {
    if (this <= 0) {
      return 1;
    } else {
      return Math.pow(2, Math.ceil(Math.log(this) / Math.log(2)));
    }
  },
  Array: function() {
    return this.map(function(x) { return x.nextPowerOfTwo(); });
  }
});
