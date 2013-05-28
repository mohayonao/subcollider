(function(sc) {
  "use strict";

  sc.register("asInteger", {
    Number: function() {
      return this|0;
    },
    Array: function() {
      return this.map(function(x) { return x.asInteger(); });
    }
  });

})(sc);
