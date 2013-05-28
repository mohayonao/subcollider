(function(sc) {
  "use strict";

  /**
   * the next power of three
   */
  sc.register("nextPowerOfThree", {
    Number: function() {
      return Math.pow(3, Math.ceil(Math.log(this) / Math.log(3)));
    },
    Array: function() {
      return this.map(function(x) { return x.nextPowerOfThree(); });
    }
  });

})(sc);
