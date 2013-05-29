/**
 * Returns a new Int32Array based upon *this*
 */
sc.define("asInt32Array", {
  Array: function() {
    return new Int32Array(this);
  }
});
