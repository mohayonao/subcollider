/**
 * Answer the first item in the receiver for which *function* answers True. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 * @example
 *  [1, 2, 3, 4].detect("even"); // => 2
 *  [1, 2, 3, 4].detect(function(x, i) { return x & i; }); // => 3
 */
sc.define("detect", {
  Array: function(func) {
    func = sc.func(func);
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) { return this[i]; }
    }
    return null;
  }
});
