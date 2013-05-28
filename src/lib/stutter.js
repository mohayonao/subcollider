(function(sc) {
  "use strict";

  sc.register("stutter", {
    Array: function(n) {
      n = n === void 0 ? 2 : Math.max(0, n|0);
      var a = new Array(this.length * n);
      for (var i = 0, j = 0, imax = this.length; i < imax; ++i) {
        for (var k = 0; k < n; ++k, ++j) {
          a[j] = this[i];
        }
      }
      return a;
    }
  });

})(sc);
