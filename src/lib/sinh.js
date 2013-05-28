(function(sc) {
  "use strict";

  /**
   * Hyperbolic sine
   */
  sc.register("sinh", {
    Number: function() {
      return (Math.pow(Math.E, this) - Math.pow(Math.E, -this)) * 0.5;
    },
    Array: function() {
      return this.map(function(x) { return x.sinh(); });
    }
  });

})(sc);
