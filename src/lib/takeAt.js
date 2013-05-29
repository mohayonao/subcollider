/**
 * Similar to `removeAt`, but does not maintain the order of the items following the one that was removed. Instead, the last item is placed into the position of the removed item and the array's size decreases by one.
 * @arguments _(index)_
 * @example
 *  y = [ 1, 2, 3, 4, 5 ];
 *  y.takeAt(1); // => 2
 *  y; // => [ 1, 5, 3, 4 ]
 */
sc.define("takeAt", {
  Array: function(index) {
    index |= 0;
    if (0 <= index && index < this.length) {
      var retVal = this[index];
      var instead = this.pop();
      if (index !== this.length) {
        this[index] = instead;
      }
      return retVal;
    }
  }
});
