(function(sc) {
  "use strict";

  sc.register("do", {
    Number: function(func) {
      func = sc.func(func);
      var i, imax = this|0;
      for (i = 0; i < imax; ++i) {
        func(i, i);
      }
      return this;
    },
    Array: function(func) {
      this.forEach(sc.func(func));
      return this;
    }
  });

})(sc);
