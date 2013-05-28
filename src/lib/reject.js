(function(sc) {
  "use strict";

  sc.register("reject", {
    Array: function(func) {
      func = sc.func(func);
      return this.filter(function(x, i) { return !func(x, i); });
    }
  });

})(sc);
