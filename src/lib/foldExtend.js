(function(sc) {
  "use strict";

  sc.register("foldExtend", {
    Array: function(size) {
      size = Math.max(0, size|0);
      var a = new Array(size);
      for (var i = 0; i < size; ++i) {
        a[i] = this.foldAt(i);
      }
      return a;
    }
  });

})(sc);
