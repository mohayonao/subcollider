(function(sc) {
  "use strict";

  sc.register("inject", {
    Array: function(thisValue, func) {
      return this.reduce(sc.func(func), thisValue);
    }
  });

})(sc);
