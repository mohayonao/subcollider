(function(sc) {
  "use strict";

  sc.register("raddeg", {
    Number: function() {
      return this * 180 / Math.PI;
    },
    Array: function() {
      return this.map(function(x) { return x.raddeg(); });
    }
  });

})(sc);
