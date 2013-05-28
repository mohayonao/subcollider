(function(sc) {
  "use strict";

  sc.register("rectWindow", {
    Number: function() {
      if (this < 0 || this > 1) { return 0; }
      return 1;
    },
    Array: function() {
      return this.map(function(x) { return x.rectWindow(); });
    }
  });

})(sc);
