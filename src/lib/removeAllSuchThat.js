(function(sc) {
  "use strict";

  sc.register("removeAllSuchThat", {
    Array: function(func) {
      func = sc.func(func);
      var remIndices = [], results = [], i, imax;
      for (i = 0, imax = this.length; i < imax; ++i) {
        if (func(this[i], i)) {
          remIndices.push(i);
          results.push(this[i]);
        }
      }
      for (i = remIndices.length; i--; ) {
        this.splice(remIndices[i], 1);
      }
      return results;
    }
  });

})(sc);
