(function(sc) {
  "use strict";

  sc.register("atModify", {
    Array: function(index, func) {
      return this.put(index, sc.func(func)(this.at(index), index));
    }
  });

})(sc);
