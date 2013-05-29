/**
 * Place *item* at the last index in the collection. Note that if the collection is empty (and therefore has no indexed slots) the item will not be added.
 * @arguments _(item)_
 * @example
 *  [3, 4, 5].putLast(100); // => [ 3, 4, 100 ]
 *  [].putLast(100); // => []
 */
sc.define("putLast", {
  Array: function(item) {
    if (this.length > 0) { this[this.length-1] = item; }
    return this;
  }
});
