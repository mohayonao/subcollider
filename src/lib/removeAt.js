(function(sc) {
  "use strict";

  sc.register("removeAt", {
    Array: function(index) {
      if (index >= 0) {
        return this.splice(index|0, 1)[0];
      }
    }
  });

})(sc);
