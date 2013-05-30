/**
 * Return the number of elements the receiver.
 * @arguments _none_
 */
sc.define("size", {
  Number: function() {
    return 0;
  },
  Boolean: function() {
    return 0;
  },
  Array: function() {
    return this.length;
  },
  String: function() {
    return this.length;
  },
  Function: function() {
    return 0;
  }
});
