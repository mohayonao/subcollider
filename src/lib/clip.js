/**
 * If the receiver is less than minVal then answer minVal, else if the receiver is greater than maxVal then answer maxVal, else answer the receiver.
 * @arguments _([lo=-1, hi=1])_
 * @example
 *  [ -0.6, -0.3, 0, 0.3, 0.6 ].clip(-0.5, 0.5); // => [ -0.5, -0.3, 0, 0.3, 0.5 ]
 */
sc.define("clip", {
  Number: function(lo, hi) {
    if (sc.isArrayArgs(arguments)) {
      return [this,lo,hi].flop().map(function(items) {
        return items[0].clip(items[1], items[2]);
      });
    }
    lo = lo === void 0 ? -1 : lo;
    hi = hi === void 0 ? +1 : hi;
    return Math.max(lo, Math.min(this, hi));
  },
  Array: function(lo, hi) {
    return this.map(function(x) { return x.clip(lo, hi); });
  }
});
