/**
 * Checks if the receiver is a boolean value.
 */
sc.define("isBoolean", {
  Number: function() {
    return false;
  },
  Boolean: function() {
    return true;
  },
  Array: function() {
    return false;
  },
  String: function() {
    return false;
  },
  Function: function() {
    return false;
  }
});
