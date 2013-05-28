(function(sc) {
  "use strict";

  /**
   * the square of the number
   */
  sc.register("squared", {
    Number: function() {
      return this * this;
    },
    Array: function() {
      return this.map(function(x) { return x.squared(); });
    }
  });

})(sc);
