/**
 * Similar to `detect` but returns the index instead of the item itself.
 * @arguments _(function)_
 */
sc.define("detectIndex", {
  Array: function(func) {
    func = sc.func(func);
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) { return i; }
    }
    return -1;
  }
});
