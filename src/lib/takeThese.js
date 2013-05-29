/**
 * Removes all items in the receiver for which the *function* answers true. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 * @example
 *  y = [1, 2, 3, 4];
 *  y.takeThese("odd"); // => [ 4, 2 ]
 *  y; // => [ 4, 2 ]
 */
sc.define("takeThese", {
  Array: function(func) {
    func = sc.func(func);
    var i = 0;
    while (i < this.length) {
      if (func(this[i], i)) {
        this.takeAt(i);
      } else {
        ++i;
      }
    }
    return this;
  }
});
