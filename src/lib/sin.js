(function(sc) {
  "use strict";

  /**
   * Sine
   */
  sc.register("sin", {
    Number: function() {
      return Math.sin(this);
    },
    Array: function() {
      return this.map(function(x) { return x.sin(); });
    }
  });

})(sc);
