/**
 * Returns the maximum depth of all subarrays.
 * @arguments _none_
 * @example
 * [[1, 2, 3], [[41, 52], 5, 6], 1, 2, 3].maxDepth(); // => 3
 */
sc.define("maxDepth", function() {
  var maxDepth = function(that, max) {
    var res, i, imax;
    res = max;
    for (i = 0, imax = that.length; i < imax; ++i) {
      if (Array.isArray(that[i])) {
        res = Math.max(res, maxDepth(that[i], max+1));
      }
    }
    return res;
  };
  return {
    Array: function() {
      return maxDepth(this, 1);
    }
  };
});
