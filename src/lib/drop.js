(function(sc) {
  "use strict";

  sc.register("drop", {
    Array: function(n) {
      n |= 0;
      if (n < 0) {
        return this.slice(0, this.length + n);
      } else {
        return this.slice(n);
      }
    }
  });

})(sc);
