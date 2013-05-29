/**
 * Returns a new Uint32Array based upon *this*
 */
sc.define("asUint32Array", {
  Array: function() {
    return new Uint32Array(this);
  }
});
