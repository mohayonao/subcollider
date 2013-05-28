(function(sc) {
  "use strict";

  /**
   * Cosine
   */
  sc.register("cos", {
    Number: function() {
      return Math.cos(this);
    },
    Array: function() {
      return this.map(function(x) { return x.cos(); });
    }
  });

})(sc);
