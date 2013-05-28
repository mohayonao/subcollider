(function(sc) {
  "use strict";

  sc.register("select", {
    Array: function(func) {
      return this.filter(sc.func(func));
    }
  });

})(sc);
