(function(sc) {
  "use strict";

  sc.register("welWindow", {
    Number: function() {
      if (this < 0 || this > 1) { return 0; }
      return Math.sin(this * Math.PI);
    },
    Array: function() {
      return this.map(function(x) { return x.welWindow(); });
    }
  });

})(sc);
