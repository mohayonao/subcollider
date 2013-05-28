(function(sc) {
  "use strict";

  sc.register("detectIndex", {
    Array: function(func) {
      func = sc.func(func);
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (func(this[i], i)) { return i; }
      }
      return -1;
    }
  });

})(sc);
