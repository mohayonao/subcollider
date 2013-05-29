/**
 * Checks if the receiver is an array.
 */
sc.define("isArray", {
  Number: function() {
    return false;
  },
  Boolean: function() {
    return false;
  },
  Array: function() {
    return true;
  },
  String: function() {
    return false;
  },
  Function: function() {
    return false;
  }
});
