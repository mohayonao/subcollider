/**
 * @arguments _none_
 * @example
 *  "0.5".asInteger(); // => 0
 *  [1, 2, 3.14].asInteger(); // => [1, 2, 3]
 */
sc.define("asInteger", {
  Number: function() {
    return this|0;
  },
  Array: function() {
    return this.map(function(x) { return x.asInteger(); });
  },
  String: function() {
    return this|0;
  }
});
