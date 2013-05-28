(function(sc) {
  "use strict";

  sc.register("notEmpty", {
    Array: function() {
      return this.length !== 0;
    }
  });

})(sc);
