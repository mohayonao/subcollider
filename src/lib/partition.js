(function(sc) {
  "use strict";

  sc.register("partition", {
    Number: function(parts, min) {
      parts = typeof parts === "undefined" ? 2 : parts;
      min = typeof min === "undefined" ? 1 : min;
      var n = this - (min - 1 * parts);
      var a = new Array(n);
      for (var i = 1; i <= n-1; ++i) {
        a[i-1] = i;
      }
      return a.scramble().keep(parts-1).sort().add(n).differentiate().opAdd(min-1);
    }
  });

})(sc);
