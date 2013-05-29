/**
 * Place *item* at the first index in the collection. Note that if the collection is empty (and therefore has no indexed slots) the item will not be added.
 * @arguments _(item)_
 * @example
 *  [3, 4, 5].putFirst(100); // => [ 100, 4, 5 ]
 *  [].putFirst(100); // => []
 */
sc.define("putFirst", {
  Array: function(item) {
    if (this.length > 0) { this[0] = item; }
    return this;
  }
});
