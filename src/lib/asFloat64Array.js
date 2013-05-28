(function(sc) {
  "use strict";

  sc.register("asFloat64Array", {
    Array: function() {
      return new Float64Array(this);
    }
  });

})(sc);
