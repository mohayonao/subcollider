(function(sc) {
  "use strict";

  sc.register("*new", {
    Array: function(size) {
      return new Array(size|0);
    }
  });

})(sc);
