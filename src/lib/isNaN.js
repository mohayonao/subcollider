(function(sc) {
  "use strict";

  sc.register("isNaN", {
    Number: function() {
      return isNaN(this);
    },
    Array: function() {
      return this.map(function(x) { return x.isNaN(); });
    }
  });

})(sc);
