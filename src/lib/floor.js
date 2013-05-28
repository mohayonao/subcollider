(function(sc) {
  "use strict";

  /**
   * next smaller integer
   */
  sc.register("floor", {
    Number: function() {
      return Math.floor(this);
    },
    Array: function() {
      return this.map(function(x) { return x.floor(); });
    }
  });

})(sc);
