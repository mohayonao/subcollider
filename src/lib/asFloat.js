(function(sc) {
  "use strict";

  sc.register("asFloat", {
    Number: function() {
      return this;
    },
    Array: function() {
      return this.map(function(x) { return x.asFloat(); });
    }
  });

})(sc);
