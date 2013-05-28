(function(sc) {
  "use strict";

  sc.register("put", {
    Array: function(index, item) {
      if (typeof index === "number") {
        if (0 <= index && index < this.length) {
          this[index|0] = item;
        }
      } else if (Array.isArray(index)) {
        index.forEach(function(index) {
          this.put(index, item);
        }, this);
      }
      return this;
    }
  });

})(sc);
