(function(sc) {
  "use strict";

  sc.register("performNearestInList", {
    Array: function(degree) {
      return this[this.indexIn(degree)];
    }
  });

})(sc);
