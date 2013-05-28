(function(sc) {
  "use strict";

  sc.register("sum3rand", {
    Number: function() {
      return (Math.random() + Math.random() + Math.random() - 1.5) * 0.666666667 * this;
    },
    Array: function() {
      return this.map(function(x) { return x.sum3rand(); });
    }
  });

})(sc);

