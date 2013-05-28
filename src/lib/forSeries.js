(function(sc) {
  "use strict";

  sc.register("forSeries", {
    Number: function(second, last, func) {
      return this.forBy(last, second - this, func);
    }
  });

})(sc);
