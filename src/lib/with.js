(function(sc) {
  "use strict";

  sc.register("*with", {
    Array: function() {
      return Array.apply(null, arguments);
    }
  });

})(sc);
