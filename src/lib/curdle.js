(function(sc) {
  "use strict";

  sc.register("curdle", {
    Array: function(probability) {
      return this.separate(function() {
        return probability.coin();
      });
    }
  });

})(sc);
