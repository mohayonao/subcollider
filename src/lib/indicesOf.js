(function(sc) {
  "use strict";

  sc.register("indicesOf", {
    Array: function(item, offset) {
      offset = offset === void 0 ? 0 : offset|0;
      var a = [];
      for (var i = offset, imax = this.length; i < imax; i++) {
        if (this[i] === item) { a.push(i); }
      }
      return a;
    }
  });

})(sc);
