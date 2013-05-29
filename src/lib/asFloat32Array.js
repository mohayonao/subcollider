/**
 * Returns a new Float32Array based upon *this*
 */
sc.define("asFloat32Array", {
  Array: function() {
    return new Float32Array(this);
  }
});
