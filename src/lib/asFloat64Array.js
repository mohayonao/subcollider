/**
 * Returns a new Float64Array based upon *this*
 */
sc.define("asFloat64Array", {
  Array: function() {
    return new Float64Array(this);
  }
});
