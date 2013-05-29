/**
 * Answer the number of items for which *function* answers True. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 * @example
 *   [1, 2, 3, 4].count("even"); // => 2
 *   [1, 2, 3, 4].count(function(x, i) { return x & i; }); // => 1
 */
sc.define("count", {
  Array: function(func) {
    func = sc.func(func);
    var sum = 0;
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) { ++sum; }
    }
    return sum;
  }
});
