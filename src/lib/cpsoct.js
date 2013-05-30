/**
 * Convert cycles per second to decimal octaves.
 * @arguments _none_
 * @example
 *   (440).cpsoct(); // => 4.75
 *   sc.Range("440, 550..880").cpsoct(); // => [ 4.75, 5.0719, 5.3349, 5.5573, 5.75 ]
 */
sc.define("cpsoct", {
  Number: function() {
    return Math.log(Math.abs(this) * 1/440) * Math.LOG2E + 4.75;
  },
  Array: function() {
    return this.map(function(x) { return x.cpsoct(); });
  }
});
