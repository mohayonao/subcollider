/**
 * Calls function for each subsequent pair of elements in the Array. The function is passed the two elements and an index.
 * @arguments _(function)_
 */
sc.define(["pairsDo", "keyValuesDo"], {
  Array: function(func) {
    func = sc.func(func);
    for (var i = 0, imax = this.length; i < imax; i += 2) {
      func(this[i], this[i+1], i);
    }
    return this;
  }
});
