/**
 * Returns the closest index of the value in the array (collection must be sorted).
 * @arguments _(item)_
 * @example
 *  [2, 3, 5, 6].indexIn(5.2); // => 2
 */
sc.define("indexIn", {
  Array: function(item) {
    var i, j = this.indexOfGreaterThan(item);
    if (j === -1) { return this.length - 1; }
    if (j ===  0) { return j; }
    i = j - 1;
    return ((item - this[i]) < (this[j] - item)) ? i : j;
  }
});
