(function(sc) {
  "use strict";

  /**
   * Base e logarithm.
   */
  sc.register("log", {
    Number: function() {
      return Math.log(this);
    },
    Array: function() {
      return this.map(function(x) { return x.log(); });
    }
  });

})(sc);
