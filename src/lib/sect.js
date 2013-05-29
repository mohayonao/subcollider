/**
 * Return the set theoretical intersection of this and *that*.
 * @arguments _(that)_
 * @example
 *  [1, 2, 3].sect([2, 3, 4, 5]); // => [ 2, 3 ]
 */
sc.define("sect", {
  Array: function(that) {
    var result = [], i, imax;
    for (i = 0, imax = this.length; i < imax; ++i) {
      if (that.indexOf(this[i]) !== -1) {
        result.push(this[i]);
      }
    }
    return result;
  }
});
