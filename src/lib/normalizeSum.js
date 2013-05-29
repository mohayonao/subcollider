/**
 * Returns the Array resulting from `this[i] / this.sum()`, so that the array will sum to 1.0.
 * @arguments _none_
 * @example
 *  [1, 2, 3].normalizeSum(); // => [ 0.1666, 0.3333, 0.5 ]
 */
sc.define("normalizeSum", {
  Array: function() {
    return this.opDiv(this.sum());
  }
});
