/**
 * whether the receiver is greater than or equal to minVal and less than or equal to maxVal.
 * @arguments _(lo, hi)_
 */
sc.define("inclusivelyBetween", {
  Number: function(lo, hi) {
    if (Array.isArray(lo) || Array.isArray(hi)) {
      return [this,lo,hi].flop().map(function(items) {
        return items[0].inclusivelyBetween(items[1], items[2]);
      });
    }
    return (lo <= this) && (this <= hi);
  },
  Array: function(lo, hi) {
    // todo: expand
    return this.map(function(x) { return x.inclusivelyBetween(lo, hi); });
  }
});
