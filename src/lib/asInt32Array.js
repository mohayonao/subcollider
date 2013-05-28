(function(sc) {
  "use strict";

  sc.register("asInt32Array", {
    Array: function() {
      return new Int32Array(this);
    }
  });

})(sc);
