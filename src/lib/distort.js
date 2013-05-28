(function(sc) {
  "use strict";

  sc.register("distort", {
    Number: function() {
      return this / (1 + Math.abs(this));
    },
    Array: function() {
      return this.map(function(x) { return x.distort(); });
    }
  });

})(sc);
