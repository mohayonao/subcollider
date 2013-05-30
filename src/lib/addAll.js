/**
 * Adds all the elements of *items* to the contents of the receiver. This method may return a new Array.
 * @arguments _(items)_
 * @example
 *  [1, 2, 3, 4].addAll([7, 8, 9]); // => [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
 */
sc.define(["addAll", "concat", "++"], {
  Array: function(items) {
    return this.concat(items);
  }
});
