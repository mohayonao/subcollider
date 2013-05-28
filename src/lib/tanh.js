(function(sc) {
  "use strict";

  /**
   * Hyperbolic tangent
   */
  sc.register("tanh", {
    Number: function() {
      return this.sinh() / this.cosh();
    },
    Array: function() {
      return this.map(function(x) { return x.tanh(); });
    }
  });

})(sc);
