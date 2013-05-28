(function(sc) {
  "use strict";

  sc.register("lace", {
    Array: function(size) {
      size = Math.max(1, size|0);
      var a = new Array(size);
      var v, wrap = this.length;
      for (var i = 0; i < size; ++i) {
        v = this[i % wrap];
        a[i] = Array.isArray(v) ? v[ ((i/wrap)|0) % v.length ] : v;
      }
      return a;
    }
  });

})(sc);
