(function(sc) {
  "use strict";

  sc.register("asFloat32Array", {
    Array: function() {
      return new Float32Array(this);
    }
  });

})(sc);
