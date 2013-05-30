/**
 * Convert an interval in semitones to a ratio.
 * @arguments _none_
 * @returns a ratio
 * @example
 *  sc.Range("0..12").midiratio(); // => [1, 1.0594, ... , 1.8877, 2]
 */
sc.define("midiratio", {
  Number: function() {
    return Math.pow(2, this * 1/12);
  },
  Array: function() {
    return this.map(function(x) { return x.midiratio(); });
  }
});
