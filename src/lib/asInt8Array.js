/**
 * Returns a new Int8Array based upon *this*
 */
sc.define("asInt8Array", {
  Array: function() {
    return new Int8Array(this);
  }
});
