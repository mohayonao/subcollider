/**
 * Extends the object to match size by adding a number of items. If size is less than receiver size then truncate. This method may return a new Array.
 * @arguments _(size, item)_
 * @example
 *  [1, 2, 3, 4].extend(10, 9); // => [ 1, 2, 3, 4, 9, 9, 9, 9, 9, 9 ]
 */
sc.define("extend", {
  Array: function(size, item) {
    size = Math.max(0, size|0);
    var a = new Array(size);
    for (var i = 0; i < size; ++i) {
      a[i] = (i < this.length) ? this[i] : item;
    }
    return a;
  }
});
