/**
 * Remove and return the element at *index*, shrinking the size of the Array.
 * @arguments _(index)_
 */
sc.define("removeAt", {
  Array: function(index) {
    if (index >= 0) {
      return this.splice(index|0, 1)[0];
    }
  }
});
