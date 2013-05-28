(function(sc) {
  "use strict";

  sc.register("isPositive", {
    Number: function() {
      return this >= 0;
    },
    Array: function() {
      return this.map(function(x) { return x.isPositive(); });
    }
  });

})(sc);
