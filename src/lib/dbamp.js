(function(sc) {
  "use strict";

  sc.register("dbamp", {
    Number: function() {
      return Math.pow(10, this * 0.05);
    },
    Array: function() {
      return this.map(function(x) { return x.dbamp(); });
    }
  });

})(sc);
