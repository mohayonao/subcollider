(function(sc) {
  "use strict";

  sc.register("asInt8Array", {
    Array: function() {
      return new Int8Array(this);
    }
  });

})(sc);
