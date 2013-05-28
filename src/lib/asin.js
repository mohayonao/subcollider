(function(sc) {
  "use strict";

  /**
   * Arcsine
   */
  sc.register("asin", {
    Number: function() {
      return Math.asin(this);
    },
    Array: function() {
      return this.map(function(x) { return x.asin(); });
    }
  });

})(sc);
