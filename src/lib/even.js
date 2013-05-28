(function(sc) {
  "use strict";

  sc.register("even", {
    Number: function() {
      return (this & 1) === 0;
    },
    Array: function() {
      return this.map(function(x) { return x.even(); });
    }
  });

})(sc);
