/**
 * Return the set of all items which are elements of this, but not of *that*.
 * @arguments _(that)_
 * @example
 *  [1, 2, 3].difference([2, 3, 4, 5]); // => [ 1 ]
 */
sc.define("difference", {
  Array: function(that) {
    return this.slice().removeAll(that);
  }
});
