(function(sc) {
  "use strict";

  sc.register("keep", {
    Array: function(n) {
      n |= 0;
      if (n < 0) {
        return this.slice(this.length + n);
      } else {
        return this.slice(0, n);
      }
    }
  });

})(sc);
