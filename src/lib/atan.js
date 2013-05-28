(function(sc) {
  "use strict";

  /**
   * Arctangent
   */
  sc.register("atan", {
    Number: function() {
      return Math.atan(this);
    },
    Array: function() {
      return this.map(function(x) { return x.atan(); });
    }
  });

})(sc);
