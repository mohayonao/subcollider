(function(sc) {
  "use strict";

  /**
   * 1 / this
   */
  sc.register("reciprocal", {
    Number: function() {
      return 1 / this;
    },
    Array: function() {
      return this.map(function(x) { return x.reciprocal(); });
    }
  });

})(sc);
