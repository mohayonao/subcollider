(function(sc) {
  "use strict";

  /**
   * @arguments exclude	an Integer.
   * @returns a random value from this.neg to this, excluding the value exclude.
   */
  sc.register("xrand2", {
    Number: function(exclude) {
      exclude = exclude === void 0 ? 0 : exclude;
      var res = (2 * this).rand() - this;
      return (res === exclude) ? this : res;
    }
  });

})(sc);
