(function(sc) {
  "use strict";

  sc.register("xrand", {
    Number: function(exclude) {
      exclude = exclude === void 0 ? 0 : exclude;
      return (exclude + (this - 1).rand() + 1) % this;
    }
  });

})(sc);
