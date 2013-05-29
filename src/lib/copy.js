/**
 * Make a copy of the receiver. (shallow copy)
 * @arguments _none_
 */
sc.define("copy", {
  Number: function() {
    return this;
  },
  Boolean: function() {
    return this;
  },
  Array: function() {
    return this.slice();
  },
  String: function() {
    return this;
  },
  Function: function() {
    return this;
  }
});
