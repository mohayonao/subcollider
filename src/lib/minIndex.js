/**
 * Answer the index of the minimum of the results of *function* evaluated for each item in the receiver. The function is passed two arguments, the item and an integer index. If function is nil, then answer the minimum of all items in the receiver.
 * @arguments _([function=nil])_
 * @example
 *  [3.2, 12.2, 13, 0.4].minIndex(); // => 3
 */
sc.define("minIndex", {
  Array: function(func) {
    var i, imax, minValue, minIndex, val;
    minIndex = -1;
    if (func) {
      func = sc.func(func);
      for (i = 0, imax = this.length; i < imax; ++i) {
        val = func(this[i], i);
        if (i === 0) {
          minValue = val;
          minIndex = 0;
        } else if (val < minValue) {
          minValue = val;
          minIndex = i;
        }
      }
    } else {
      // optimized version if no function
      val = this[0];
      minValue = val;
      minIndex = 0;
      for (i = 1, imax = this.length; i < imax; ++i) {
        val = this[i];
        if (val < minValue) {
          minValue = val;
          minIndex = i;
        }
      }
    }
    return minIndex;
  }
});
