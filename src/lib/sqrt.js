(function(sc) {
  "use strict";

  /**
   * the square root of the number.
   */
  sc.register("sqrt", {
    Number: function() {
      return Math.sqrt(this);
    },
    Array: function() {
      return this.map(function(x) { return x.sqrt(); });
    }
  });

})(sc);
