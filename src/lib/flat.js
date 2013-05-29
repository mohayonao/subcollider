/**
 * Returns a collection from which all nesting has been flattened.
 * @arguments _none_
 * @example
 *   [[1, 2, 3], [[4, 5], [[6]]]].flat(); // => [ 1, 2, 3, 4, 5, 6 ]
 */
sc.define("flat", function() {
  var flat = function(that, list) {
    var i, imax;
    for (i = 0, imax = that.length; i < imax; ++i) {
      if (Array.isArray(that[i])) {
        list = flat(that[i], list);
      } else {
        list.push(that[i]);
      }
    }
    return list;
  };
  return {
    Array: function() {
      return flat(this, []);
    }
  };
});
