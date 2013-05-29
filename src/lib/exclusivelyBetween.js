/**
 * whether the receiver is greater than minVal and less than maxVal.
 * @arguments _(lo, hi)_
 */
sc.define("exclusivelyBetween", {
  Number: function(lo, hi) {
    if (Array.isArray(lo) || Array.isArray(hi)) {
      return [this,lo,hi].flop().map(function(items) {
        return items[0].exclusivelyBetween(items[1], items[2]);
      });
    }
    return (lo <= this) && (this < hi);
  },
  Array: function(lo, hi) {
    // todo: expand
    return this.map(function(x) { return x.exclusivelyBetween(lo, hi); });
  }
});
