/**
 * Return the first element of the collection.
 * @arguments _none_
 * @example
 *  [3, 4, 5].first(); // => 3
 */
sc.define("first", {
  Array: function() {
    return this[0];
  }
});
