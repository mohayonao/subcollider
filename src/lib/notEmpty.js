/**
 * Checks is the receiver is not empty.
 */
sc.define("notEmpty", {
  Array: function() {
    return this.length !== 0;
  }
});
