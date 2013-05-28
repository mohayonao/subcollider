(function(sc) {
  "use strict";

  sc.register("sect", {
    Array: function(that) {
      var result = [], i, imax;
      for (i = 0, imax = this.length; i < imax; ++i) {
        if (that.indexOf(this[i]) !== -1) {
          result.push(this[i]);
        }
      }
      return result;
    }
  });

})(sc);
