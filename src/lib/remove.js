/**
 * Remove *item* from the receiver.
 * @arguments _(item)_
 */
sc.define("remove", {
  Array: function(item) {
    var index = this.indexOf(item);
    if (index !== -1) {
      return this.splice(index, 1)[0];
    }
    return null;
  }
});
