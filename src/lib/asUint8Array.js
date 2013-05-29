/**
 * Returns a new Uint8Array based upon *this*
 */
sc.define("asUint8Array", {
  Array: function() {
    return new Uint8Array(this);
  }
});
