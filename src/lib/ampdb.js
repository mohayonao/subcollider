/**
 * Convert a linear amplitude to decibels.
 * @arguments _none_
 * @example
 *  [0.5, 1, 2].ampdb(); // => [ -6.0205, 0, 6.0205 ]
 */
sc.define("ampdb", {
  Number: function() {
    return Math.log(this) * Math.LOG10E * 20;
  },
  Array: function() {
    return this.map(function(x) { return x.ampdb(); });
  }
});
