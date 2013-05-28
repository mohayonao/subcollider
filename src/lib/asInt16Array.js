(function(sc) {
  "use strict";

  sc.register("asInt16Array", {
    Array: function() {
      return new Int16Array(this);
    }
  });

})(sc);
