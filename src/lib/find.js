(function(sc) {
  "use strict";

  sc.register("find", {
    Array: function(sublist, offset) {
      if (!Array.isArray(sublist)) {
        return -1;
      }
      offset = Math.max(0, offset|0);
      for (var i = offset, imax = this.length; i < imax; ++i) {
        var b = true;
        for (var j = 0, jmax = sublist.length; j < jmax; j++) {
          if (this[i + j] !== sublist[j]) {
            b = false;
            break;
          }
        }
        if (b) { return i; }
      }
      return -1;
    }
  });

})(sc);
