(function(sc) {
  "use strict";

  sc.register(["bitNot", "~"], {
    Number: function() {
      return ~this;
    },
    Array: function() {
      return this.map(function(x) { return x.bitNot(); });
    }
  });

})(sc);
