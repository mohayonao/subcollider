(function(sc) {
  "use strict";

  sc.register("isSubsetOf", {
    Array: function(that) {
      return that.includesAll(this);
    }
  });

})(sc);
