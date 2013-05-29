/**
 * Keep the first *n* items of the array. If *n* is negative, keep the last *-n* items.
 * @arguments _(n)_
 * @example
 *  [1, 2, 3, 4, 5].keep( 3); // => [ 1, 2, 3 ]
 *  [1, 2, 3, 4, 5].keep(-3); // => [ 3, 4, 5 ]
 */
sc.define("keep", {
  Array: function(n) {
    n |= 0;
    if (n < 0) {
      return this.slice(this.length + n);
    } else {
      return this.slice(0, n);
    }
  }
});
