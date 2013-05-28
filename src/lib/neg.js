(function(sc) {
  "use strict";

  /**
   * negation
   */
  sc.register("neg", {
    Number: function() {
      return -this;
    },
    Array: function() {
      return this.map(function(x) { return x.neg(); });
    }
  });

})(sc);
