(function(sc) {
  "use strict";

  sc.register("resamp0", {
    Array: function(newSize) {
      var factor = (this.length - 1) / (newSize - 1);
      var a = new Array(newSize);
      for (var i = 0; i < newSize; ++i) {
        a[i] = this[Math.round(i * factor)];
      }
      return a;
    }
  });

})(sc);
