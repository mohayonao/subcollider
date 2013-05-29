/**
 * Checks if the receiver is empty.
 */
sc.define("isEmpty", {
  Array: function() {
    return this.length === 0;
  }
});
