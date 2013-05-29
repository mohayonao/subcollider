/**
 * the folded value, a bitwise or with aNumber
 * @arguments _(lo, hi)_
 */
sc.define("fold", {
  Number: function(lo, hi) {
    if (Array.isArray(lo) || Array.isArray(hi)) {
      return [this,lo,hi].flop().map(function(items) {
        return items[0].fold(items[1], items[2]);
      });
    }
    var _in = this, x, c, range, range2;
    x = _in - lo;
    if (_in >= hi) {
      _in = hi + hi - _in;
      if (_in >= lo) { return _in; }
    } else if (_in < lo) {
      _in = lo + lo - _in;
      if (_in < hi) { return _in; }
    } else { return _in; }

    if (hi === lo) { return lo; }
    range = hi - lo;
    range2 = range + range;
    c = x - range2 * Math.floor(x / range2);
    if (c >= range) { c = range2 - c; }
    return c + lo;
  },
  Array: function(lo, hi) {
    return this.map(function(x) { return x.fold(lo, hi); });
  }
});
