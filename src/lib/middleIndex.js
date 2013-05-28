(function(sc) {
  "use strict";

  sc.register("middleIndex", {
    Array: function() {
      return (this.length - 1) >> 1;
    }
  });

})(sc);
