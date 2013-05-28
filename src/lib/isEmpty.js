(function(sc) {
  "use strict";

  sc.register("isEmpty", {
    Array: function() {
      return this.length === 0;
    }
  });

})(sc);
