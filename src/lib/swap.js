/**
 * Swap two elements in the collection at indices i and j.
 * @arguments _(i, j)_
 * @example
 *  [0,1,2,3,4,5].swap(2, 3); // => [0, 1, 3, 2, 4, 5]
 */
sc.define("swap", {
  Array: function(i, j) {
    if (0 <= i && i < this.length && 0 <= j && j < this.length) {
      var t = this[i|0];
      this[i|0] = this[j|0];
      this[j|0] = t;
    }
    return this;
  }
});
