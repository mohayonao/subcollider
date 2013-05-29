/**
 * Return the first index containing an *item* which is greater than *item*.
 * @arguments _(item)_
 * @example
 *  [10, 5, 77, 55, 12, 123].indexOfGreaterThan(70); // => 2
 */
sc.define("indexOfGreaterThan", {
  Array: function(item) {
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (this[i] > item) { return i; }
    }
    return -1;
  }
});
