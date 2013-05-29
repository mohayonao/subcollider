/**
 * Inserts the *item* before the contents of the receiver, possibly returning a new Array.
 * @arguments _(item)_
 * @example
 *  [1, 2, 3, 4].addFirst(999); // [ 999, 2, 3, 4 ]
 */
sc.define("addFirst", {
  Array: function(item) {
    return [item].concat(this);
  }
});
