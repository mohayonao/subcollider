(function(sc) {
  "use strict";

  sc.register("binaryValue", {
    Number: function() {
      return this > 0 ? 1 : 0;
    },
    Array: function() {
      return this.map(function(x) { return x.binaryValue(); });
    }
  });

})(sc);
