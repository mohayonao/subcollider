/**
 * Calls function for every adjacent pair of elements in the Array. The function is passed the two adjacent elements and an index.
 * @arguments _(function)_
 */
sc.define("doAdjacentPairs", {
  Array: function(func) {
    func = sc.func(func);
    for (var i = 0, imax = this.length - 1; i < imax; ++i) {
      func(this[i], this[i+1], i);
    }
    return this;
  }
});
