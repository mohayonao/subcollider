(function(sc) {
  "use strict";

  /**
   * Answer -1 if negative, +1 if positive or 0 if zero.
   */
  sc.register("sign", {
    Number: function() {
      return this > 0 ? +1 : this === 0 ? 0 : -1;
    },
    Array: function() {
      return this.map(function(x) { return x.sign(); });
    }
  });

})(sc);
