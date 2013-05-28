(function(sc) {
  "use strict";

  sc.register("difference", {
    Array: function(that) {
      return this.slice().removeAll(that);
    }
  });

})(sc);
