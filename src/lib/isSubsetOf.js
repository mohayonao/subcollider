/**
 * Returns True if all elements of this are also elements of *that*
 * @arguments _(that)_
 * @example
 *  [1, 2].isSubsetOf([ 1, 2, 3, 4]); // => true
 *  [1, 5].isSubsetOf([ 1, 2, 3, 4]); // => false
 */
sc.define("isSubsetOf", {
  Array: function(that) {
    return that.includesAll(this);
  }
});
