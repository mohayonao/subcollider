(function(sc) {
  "use strict";

  sc.register("addIfNotNil", {
    Array: function(item) {
      if (item !== null) {
        return this.concat([item]);
      }
      return this;
    }
  });

})(sc);
