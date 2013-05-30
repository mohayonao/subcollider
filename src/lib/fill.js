/**
 * Creates an Array of the given size, the elements of which are determined by evaluation the given function.
 * @arguments _(size [, function=nil])_
 * @example
 *  Array.fill(3, 5); // => [ 5, 5, 5 ]
 *  Array.fill(3, function(i) { return (i * 2 + 60).midicps(); });
 *  // => [ 440, 493.8833, 554.3652 ]
 */
sc.define("*fill", {
  Array: function(size, func) {
    size |= 0;
    func = sc.func(func);
    var a = new Array(size);
    for (var i = 0; i < size; i++) {
      a[i] = func(i);
    }
    return a;
  }
});

/**
 * Inserts the item into the contents of the receiver.
 * @arguments _(item)_
 * @example
 *  [1, 2, 3, 4].fill(4); // [ 4, 4, 4, 4 ]
 */
sc.define("fill", {
  Array: function(item) {
    for (var i = 0, imax = this.length; i < imax; i++) {
      this[i] = item;
    }
    return this;
  }
});
