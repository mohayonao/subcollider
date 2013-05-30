/**
 * Convert a ratio to an interval in semitones.
 * @arguments _none_
 * @returns an interval in semitones
 * @example
 *  sc.Range("1, 1.2..2").ratiomidi();
 *  // => [ 0, 3.1564, 5.8251, 8.1368, 10.1759, 11.9999 ]
 */
sc.define("ratiomidi", {
  Number: function() {
    return Math.log(Math.abs(this)) * Math.LOG2E * 12;
  },
  Array: function() {
    return this.map(function(x) { return x.ratiomidi(); });
  }
});
