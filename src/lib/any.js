(function(sc) {
  "use strict";

  sc.register("any", {
    Array: function(func) {
      func = sc.func(func);
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (func(this[i], i)) { return true; }
      }
      return false;
    }
  });

})(sc);
