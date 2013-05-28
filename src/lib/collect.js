(function(sc) {
  "use strict";

  sc.register("collect", {
    Number: function(func) {
      func = sc.func(func);
      var a = new Array(this|0);
      for (var i = 0, imax = a.length; i < imax; ++i) {
        a[i] = func(i);
      }
      return a;
    },
    Array: function(func) {
      return this.map(sc.func(func));
    }
  });

})(sc);
