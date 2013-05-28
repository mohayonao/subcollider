(function(sc) {
  "use strict";

  sc.register("rotate", {
    Array: function(n) {
      n = n === void 0 ? 1 : n|0;
      var a = new Array(this.length);
      var size = a.length;
      n %= size;
      if (n < 0) { n = size + n; }
      for (var i = 0, j = n; i < size; ++i) {
        a[j] = this[i];
        if (++j >= size) { j = 0; }
      }
      return a;
    }
  });

})(sc);
