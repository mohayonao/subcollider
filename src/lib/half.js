(function(sc) {
  "use strict";

  sc.register("half", {
    Number: function() {
      return this * 0.5;
    },
    Array: function() {
      return this.map(function(x) { return x.half(); });
    }
  });

})(sc);
