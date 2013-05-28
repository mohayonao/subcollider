(function(sc) {
  "use strict";

  sc.register("ramp", {
    Number: function() {
      if (this <= 0) { return 0; }
      if (this >= 1) { return 1; }
      return this;
    },
    Array: function() {
      return this.map(function(x) { return x.ramp(); });
    }
  });

})(sc);
