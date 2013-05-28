(function(sc) {
  "use strict";

  sc.register("asUint8Array", {
    Array: function() {
      return new Uint8Array(this);
    }
  });

})(sc);
