/**
 * Return a new Array whose elements are reversed.
 * @arguments _none_
 */
sc.define(["reverse", "sc_reverse"], {
  Array: function() {
    return this.slice().reverse();
  }
});
