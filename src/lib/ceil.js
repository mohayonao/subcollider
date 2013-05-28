(function(sc) {
  "use strict";

  /**
   * next larger integer.
   */
  sc.register("ceil", {
    Number: function() {
      return Math.ceil(this);
    },
    Array: function() {
      return this.map(function(x) { return x.ceil(); });
    }
  });

})(sc);
