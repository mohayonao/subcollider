(function(sc) {
  "use strict";

  sc.register("lastIndex", {
    Array: function() {
      return this.length - 1;
    }
  });

})(sc);
