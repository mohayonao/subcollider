/**
 * Convert cycles per second to MIDI note.
 * @arguments _none_
 * @returns midi note
 * @example
 *  (440).cpsmidi(); // => 69
 *  sc.Range("440, 550..880").cpsmidi(); // => [69, 72.8631, 76.0195, 78.6882, 81 ]
 */
sc.define("cpsmidi", {
  Number: function() {
    return Math.log(Math.abs(this) * 1/440) * Math.LOG2E * 12 + 69;
  },
  Array: function() {
    return this.map(function(x) { return x.cpsmidi(); });
  }
});
