/**
 * Returns a new Uint16Array based upon *this*
 */
sc.define("asUint16Array", {
  Array: function() {
    return new Uint16Array(this);
  }
});
