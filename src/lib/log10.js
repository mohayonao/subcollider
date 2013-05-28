(function(sc) {
  "use strict";

  /**
   * Base 10 logarithm.
   */
  sc.register("log10", {
    Number: function() {
      return Math.log(this) * Math.LOG10E;
    },
    Array: function() {
      return this.map(function(x) { return x.log10(); });
    }
  });

})(sc);
