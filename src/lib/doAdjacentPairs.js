(function(sc) {
  "use strict";

  sc.register("doAdjacentPairs", {
    Array: function(func) {
      func = sc.func(func);
      for (var i = 0, imax = this.length - 1; i < imax; ++i) {
        func(this[i], this[i+1], i);
      }
      return this;
    }
  });

})(sc);
