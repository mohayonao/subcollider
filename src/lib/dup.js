/**
 * Duplicates the receiver *n* times.
 * @arguments _([n=2])_
 * @example
 *   (2).dup(5); // => [ 2, 2, 2, 2, 2 ]
 *   [1, 2, 3].dup(3) // => [ [1, 2, 3], [1, 2, 3], [1, 2, 3] ]
 */
sc.define("dup", function() {
  var dup = function(n) {
    n = n === void 0 ? 2 : n;
    var a = new Array(n|0);
    for (var i = 0, imax = a.length; i < imax; ++i) {
      a[i] = this;
    }
    return a;
  };
  return {
    Number : dup,
    Boolean: dup,
    Array  : function(n) {
      n = n === void 0 ? 2 : n;
      var a = new Array(n|0);
      for (var i = 0, imax = a.length; i < imax; ++i) {
        a[i] = this.slice();
      }
      return a;
    },
    String: dup,
    Function: function(n) {
      n = n === void 0 ? 2 : n;
      return Array.fill(n|0, this);
    }
  };
});
