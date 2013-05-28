(function(sc) {
  "use strict";

  sc.register("*newClear", {
    Array: function(size) {
      var a = new Array(size|0);
      for (var i = 0, imax = a.length; i < imax; i++) {
        a[i] = 0;
      }
      return a;
    }
  });

})(sc);
