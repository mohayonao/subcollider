/**
 * Drop the first *n* items of the array. If *n* is negative, drop the last *-n* items.
 * @arguments _(number)_
 * @example
 *   [1, 2, 3, 4, 5].drop( 3); // [ 4, 5 ]
 *   [1, 2, 3, 4, 5].drop(-3); // [ 1, 2 ] 
 */
sc.define("drop", {
  Array: function(n) {
    n |= 0;
    if (n < 0) {
      return this.slice(0, this.length + n);
    } else {
      return this.slice(n);
    }
  }
});
