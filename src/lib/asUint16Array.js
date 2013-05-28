(function(sc) {
  "use strict";

  sc.register("asUint16Array", {
    Array: function() {
      return new Uint16Array(this);
    }
  });

})(sc);
