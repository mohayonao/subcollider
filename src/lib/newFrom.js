(function(sc) {
  "use strict";

  sc.register("*newFrom", {
    Array: function(item) {
      return item.slice();
    }
  });

})(sc);
