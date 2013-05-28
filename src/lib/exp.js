(function(sc) {
  "use strict";

  /**
   * e to the power of the receiver.
   */
  sc.register("exp", {
    Number: function() {
      return Math.exp(this);
    },
    Array: function() {
      return this.map(function(x) { return x.exp(); });
    }
  });

})(sc);
