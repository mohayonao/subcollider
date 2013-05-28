(function(sc) {
  "use strict";

  /**
   * Tangent
   */
  sc.register("tan", {
    Number: function() {
      return Math.tan(this);
    },
    Array: function() {
      return this.map(function(x) { return x.tan(); });
    }
  });

})(sc);
