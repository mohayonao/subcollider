(function(sc) {
  "use strict";

  sc.register("triWindow", {
    Number: function() {
      if (this < 0 || this > 1) { return 0; }
      return (this < 0.5) ? 2 * this : -2 * this + 2;
    },
    Array: function() {
      return this.map(function(x) { return x.triWindow(); });
    }
  });

})(sc);
