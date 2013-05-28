(function(sc) {
  "use strict";

  sc.register("includesAny", {
    Array: function(item) {
      for (var i = 0, imax = item.length; i < imax; ++i) {
        if (this.indexOf(item[i]) !== -1) { return true; }
      }
      return false;
    }
  });

})(sc);
