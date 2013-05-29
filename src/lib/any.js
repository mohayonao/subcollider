/**
 * Answer whether *function* answers True for any item in the receiver. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 * @example
 *  [1, 2, 3, 4].any("even"); // => true
 *  [1, 2, 3, 4].any(function(x) { return x > 10; }); // => false
 */
sc.define("any", {
  Array: function(func) {
    func = sc.func(func);
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) { return true; }
    }
    return false;
  }
});
