/**
 * Wrapping at *lo* and *hi*.
 * @arguments _(lo, hi)_
 */
sc.define("wrap", {
  Number: function(lo, hi) {
    if (Array.isArray(lo) || Array.isArray(hi)) {
      return [this,lo,hi].flop().map(function(items) {
        return items[0].wrap(items[1], items[2]);
      });
    }
    if (lo > hi) {
      return this.wrap(hi, lo);
    }
    var _in = this, range;
    if (_in >= hi) {
      range = hi - lo;
      _in -= range;
      if (_in < hi) { return _in; }
    } else if (_in < lo) {
      range = hi - lo;
      _in += range;
      if (_in >= lo) { return _in; }
    } else { return _in; }

    if (hi === lo) { return lo; }
    return _in - range * Math.floor((_in - lo) / range);
  },
  Array: function(lo, hi) {
    return this.map(function(x) { return x.wrap(lo, hi); });
  }
});
