(function(sc) {
  "use strict";

  sc.register("clip", {
    Number: function(lo, hi) {
      if (Array.isArray(lo) || Array.isArray(hi)) {
        return [this,lo,hi].flop().map(function(items) {
          return items[0].clip(items[1], items[2]);
        });
      }
      return Math.max(lo, Math.min(this, hi));
    },
    Array: function(lo, hi) {
      return this.map(function(x) { return x.clip(lo, hi); });
    }
  });

})(sc);
