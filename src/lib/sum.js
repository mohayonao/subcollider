(function(sc) {
  "use strict";

  sc.register("sum", {
    Array: function(func) {
      var sum = 0, i, imax;
      if (func) {
        func = sc.func(func);
        for (i = 0, imax = this.length; i < imax; ++i) {
          sum = sum.opAdd(func(this[i]));
        }
      } else {
        // optimized version if no function
        for (i = 0, imax = this.length; i < imax; ++i) {
          sum = sum.opAdd(this[i]);
        }
      }
      return sum;
    }
  });

})(sc);
