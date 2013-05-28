(function(sc) {
  "use strict";

  sc.register("foldPut", {
    Array: function(index, item) {
      if (typeof index === "number") {
        this[index.fold(0, this.length-1)] = item;
      } else if (Array.isArray(index)) {
        index.forEach(function(index) {
          this.foldPut(index, item);
        }, this);
      }
      return this;
    }
  });

})(sc);
