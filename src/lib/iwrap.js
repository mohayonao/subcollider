sc.define("iwrap", {
  Number: function(lo, hi) {
    if (Array.isArray(lo) || Array.isArray(hi)) {
      return [this,lo,hi].flop().map(function(items) {
        return items[0].iwrap(items[1], items[2]);
      });
    }
    var _in = this|0, b2, c;
    lo |= 0;
    hi |= 0;
    if (lo <= hi) {
      if (lo <= _in && _in <= hi) {
        return _in;
      }
      b2 = hi - lo + 1;
      c  = (_in - lo) % b2;
      if (c < 0) { c += b2; }
      return c + lo;
    }
  },
  Array: function(lo, hi) {
    return this.map(function(x) { return x.iwrap(lo, hi); });
  }
});
