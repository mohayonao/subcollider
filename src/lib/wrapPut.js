(function(sc) {
  "use strict";

  sc.register("wrapPut", {
    Array: function(index, item) {
      if (typeof index === "number") {
        this[index.iwrap(0, this.length-1)] = item;
      } else if (Array.isArray(index)) {
        index.forEach(function(index) {
          this.wrapPut(index, item);
        }, this);
      }
      return this;
    }
  });

})(sc);
