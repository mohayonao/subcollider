(function(sc) {
  "use strict";

  sc.register("includes", {
    Array: function(item) {
      return this.indexOf(item) !== -1;
    }
  });

})(sc);
