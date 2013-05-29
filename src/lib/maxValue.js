/**
 * Answer the maximum of the results of *function* evaluated for each item in the receiver. The function is passed two arguments, the item and an integer index.
 * @arguments _([function=nil])_
 * @example
 *  [ 1, 5, 2, 4, 3 ].maxValue(); // => 5
 */
sc.define(["maxValue", "maxItem"], {
  Array: function(func) {
    var i, imax, maxValue, maxElement, val;
    if (func) {
      func = sc.func(func);
      for (i = 0, imax = this.length; i < imax; ++i) {
        val = func(this[i], i);
        if (i === 0) {
          maxValue = val;
          maxElement = this[i];
        } else if (val > maxValue) {
          maxValue = val;
          maxElement = this[i];
        }
      }
    } else {
      // optimized version if no function
      val = this[0];
      maxValue = val;
      maxElement = this[0];
      for (i = 1, imax = this.length; i < imax; ++i) {
        val = this[i];
        if (val > maxValue) {
          maxValue = val;
          maxElement = this[i];
        }
      }
    }
    return maxElement;
  }
});
