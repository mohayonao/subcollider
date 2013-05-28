(function(sc) {
  "use strict";

  sc.register("midiratio", {
    Number: function() {
      return Math.pow(2, this * 1/12);
    },
    Array: function() {
      return this.map(function(x) { return x.midiratio(); });
    }
  });

})(sc);
