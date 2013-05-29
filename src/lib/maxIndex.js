/**
 * Answer the index of the maximum of the results of *function* evaluated for each item in the receiver. The function is passed two arguments, the item and an integer index. If function is nil, then answer the maximum of all items in the receiver.
 * @arguments _([func=nil])_
 * @example
 *  [3.2, 12.2, 13, 0.4].maxIndex(); // => 2
 */
sc.define("maxIndex", {
  Array: function(func) {
    var i, imax, maxValue, maxIndex, val;
    maxIndex = -1;
    if (func) {
      func = sc.func(func);
      for (i = 0, imax = this.length; i < imax; ++i) {
        val = func(this[i], i);
        if (i === 0) {
          maxValue = val;
          maxIndex = 0;
        } else if (val > maxValue) {
          maxValue = val;
          maxIndex = i;
        }
      }
    } else {
      // optimized version if no function
      val = this[0];
      maxValue = val;
      maxIndex = 0;
      for (i = 1, imax = this.length; i < imax; ++i) {
        val = this[i];
        if (val > maxValue) {
          maxValue = val;
          maxIndex = i;
        }
      }
    }
    return maxIndex;
  }
});
