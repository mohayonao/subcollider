(function(sc) {
  "use strict";

  sc.register("flatten", {
    Array: function(numLevels) {
      var list, i, imax;
      numLevels = numLevels === void 0 ? 1 : numLevels|0;
      if (numLevels <= 0) { return this; }
      numLevels -= 1;
      list = [];
      for (i = 0, imax = this.length; i < imax; ++i) {
        if (Array.isArray(this[i])) {
          list = list.addAll(this[i].flatten(numLevels));
        } else {
          list.push(this[i]);
        }
      }
      return list;
    }
  });

})(sc);
