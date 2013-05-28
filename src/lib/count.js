(function(sc) {
  "use strict";

  sc.register("count", {
    Array: function(func) {
      func = sc.func(func);
      var sum = 0;
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (func(this[i], i)) { ++sum; }
      }
      return sum;
    }
  });

})(sc);
