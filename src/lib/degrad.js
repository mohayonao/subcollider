(function(sc) {
  "use strict";

  sc.register("degrad", {
    Number: function() {
      return this * Math.PI / 180;
    },
    Array: function() {
      return this.map(function(x) { return x.degrad(); });
    }
  });

})(sc);
