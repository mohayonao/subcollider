(function(sc) {
  "use strict";

  sc.register("detect", {
    Array: function(func) {
      func = sc.func(func);
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (func(this[i], i)) { return this[i]; }
      }
      return null;
    }
  });

})(sc);
