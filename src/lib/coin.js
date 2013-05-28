(function(sc) {
  "use strict";

  sc.register("coin", {
    Number: function() {
      return Math.random() < this;
    },
    Array: function() {
      return this.map(function(x) { return x.coin(); });
    }
  });

})(sc);
