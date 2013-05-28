(function(sc) {
  "use strict";

  sc.register("maxDepth", {
    Array: function(max) {
      var res, i, imax;
      max = max === void 0 ? 1 : max;
      res = max;
      for (i = 0, imax = this.length; i < imax; ++i) {
        if (Array.isArray(this[i])) {
          res = Math.max(res, this[i].maxDepth(max+1));
        }
      }
      return res;
    }
  });

})(sc);
