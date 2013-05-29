/**
 * Checks if the receiver is a number.
 */
sc.define("isNumber", {
  Number: function() {
    return true;
  },
  Boolean: function() {
    return false;
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
