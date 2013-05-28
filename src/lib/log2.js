(function(sc) {
  "use strict";

  /**
   * Base 2 logarithm.
   */
  sc.register("log2", {
    Number: function() {
      return Math.log(Math.abs(this)) * Math.LOG2E;
    },
    Array: function() {
      return this.map(function(x) { return x.log2(); });
    }
  });

})(sc);
