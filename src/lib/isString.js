/**
 * Checks if the receiver is a string.
 */
sc.define("isString", {
  Number: function() {
    return false;
  },
  Boolean: function() {
    return false;
  },
  Array: function() {
    return false;
  },
  String: function() {
    return true;
  },
  Function: function() {
    return false;
  }
});
