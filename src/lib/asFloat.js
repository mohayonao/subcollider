/**
 * @arguments _none_
 * @example
 *  "0.5".asFloat(); // => 0.5
 *  [1, 2, 3.14].asFloat(); // => [1, 2, 3.14]
 */
sc.define("asFloat", {
  Number: function() {
    return this;
  },
  Array: function() {
    return this.map(function(x) { return x.asFloat(); });
  },
  String: function() {
    return +this;
  }
});
