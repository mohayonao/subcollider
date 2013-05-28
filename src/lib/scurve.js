(function(sc) {
  "use strict";

  sc.register("scurve", {
    Number: function() {
      if (this <= 0) { return 0; }
      if (this >= 1) { return 1; }
      return this * this * (3 - 2 * this);
    },
    Array: function() {
      return this.map(function(x) { return x.scurve(); });
    }
  });

})(sc);
