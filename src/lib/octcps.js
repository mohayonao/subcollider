(function(sc) {
  "use strict";

  sc.register("octcps", {
    Number: function() {
      return 440 * Math.pow(2, this - 4.75);
    },
    Array: function() {
      return this.map(function(x) { return x.octcps(); });
    }
  });

})(sc);
