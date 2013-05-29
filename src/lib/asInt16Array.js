/**
 * Returns a new Int16Array based upon *this*
 */
sc.define("asInt16Array", {
  Array: function() {
    return new Int16Array(this);
  }
});
