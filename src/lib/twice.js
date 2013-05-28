(function(sc) {
  "use strict";

  sc.register("twice", {
    Number: function() {
      return this * 2;
    },
    Array: function() {
      return this.map(function(x) { return x.twice(); });
    }
  });

})(sc);
