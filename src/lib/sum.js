/**
 * Answer the sum of the results of function evaluated for each item in the receiver. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 * @example
 *  sc.Range("0..10").sum(); // => 55
 */
sc.define("sum", {
  Array: function(func) {
    var sum = 0, i, imax;
    if (func) {
      func = sc.func(func);
      for (i = 0, imax = this.length; i < imax; ++i) {
        sum = sum.opAdd(func(this[i]));
      }
    } else {
      // optimized version if no function
      for (i = 0, imax = this.length; i < imax; ++i) {
        sum = sum.opAdd(this[i]);
      }
    }
    return sum;
  }
});
