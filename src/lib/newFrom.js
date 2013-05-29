/**
 * Creates a new Collection from another collection.
 * @arguments _(array)_
 */
sc.define("*newFrom", {
  Array: function(item) {
    return item.slice();
  }
});
