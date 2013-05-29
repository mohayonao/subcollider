/**
 * Convert a decibels to a linear amplitude.
 * @arguments _none_
 * @example
 *   (12).dbamp(); // => 3.981071705534973
 *   [-6, -3, 0, 3, 6].dbamp(); // => [ 0.5011, 0.7079, 1, 1.412, 1.9952 ]
 */
sc.define("dbamp", {
  Number: function() {
    return Math.pow(10, this * 0.05);
  },
  Array: function() {
    return this.map(function(x) { return x.dbamp(); });
  }
});
