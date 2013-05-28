(function(sc) {
  "use strict";

  sc.register("injectr", {
    Array: function(thisValue, func) {
      return this.reduceRight(sc.func(func), thisValue);
    }
  });

})(sc);
