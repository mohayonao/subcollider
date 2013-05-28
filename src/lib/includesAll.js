(function(sc) {
  "use strict";

  sc.register("includesAll", {
    Array: function(item) {
      for (var i = 0, imax = item.length; i < imax; ++i) {
        if (this.indexOf(item[i]) === -1) { return false; }
      }
      return true;
    }
  });

})(sc);
