/**
 * Returns the maximum size of all subarrays at a certain depth (dimension)
 * @arguments _(rank)_
 */
sc.define("maxSizeAtDepth", {
  Array: function(rank) {
    var maxsize = 0, sz, i, imax;
    if (rank === 0 || rank === void 0) { return this.length; }
    for (i = 0, imax = this.length; i < imax; ++i) {
      sz = Array.isArray(this[i]) ? this[i].maxSizeAtDepth(rank-1) : 1;
      if (sz > maxsize) { maxsize = sz; }
    }
    return maxsize;
  }
});
