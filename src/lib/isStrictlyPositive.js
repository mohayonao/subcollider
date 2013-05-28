(function(sc) {
  "use strict";

  sc.register("isStrictlyPositive", {
    Number: function() {
      return this > 0;
    },
    Array: function() {
      return this.map(function(x) { return x.isStrictlyPositive(); });
    }
  });

})(sc);
