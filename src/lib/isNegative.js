(function(sc) {
  "use strict";

  sc.register("isNegative", {
    Number: function() {
      return this < 0;
    },
    Array: function() {
      return this.map(function(x) { return x.isNegative(); });
    }
  });

})(sc);
