(function(sc) {
  "use strict";

  /**
   * the cube of the number
   */
  sc.register("cubed", {
    Number: function() {
      return this * this * this;
    },
    Array: function() {
      return this.map(function(x) { return x.cubed(); });
    }
  });

})(sc);
