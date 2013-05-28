(function(sc) {
  "use strict";

  sc.register("findAll", {
    Array: function(sublist, offset) {
      if (!Array.isArray(sublist)) {
        return [];
      }
      offset = Math.max(0, offset|0);
      var a = [];
      for (var i = offset, imax = this.length; i < imax; ++i) {
        var b = true;
        for (var j = 0, jmax = sublist.length; j < jmax; ++j) {
          if (this[i + j] !== sublist[j]) {
            b = false;
            break;
          }
        }
        if (b) { a.push(i); }
      }
      return a;
    }
  });

})(sc);
