/**
 * Return a boolean indicating whether the collection contains anything matching *item*.
 * @arguments _(item)_
 */
sc.define("includes", {
  Array: function(item) {
    return this.indexOf(item) !== -1;
  }
});
