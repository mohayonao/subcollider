(function(sc) {
  "use strict";

  sc.register("asUint32Array", {
    Array: function() {
      return new Uint32Array(this);
    }
  });

})(sc);
