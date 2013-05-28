(function(sc) {
  "use strict";

  sc.register("middle", {
    Array: function() {
      return this[(this.length - 1) >> 1];
    }
  });

})(sc);
