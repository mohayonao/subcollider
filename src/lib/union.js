(function(sc) {
  "use strict";

  sc.register("union", {
    Array: function(that) {
      var result = this.slice(), i, imax;
      for (i = 0, imax = that.length; i < imax; ++i) {
        if (result.indexOf(that[i]) === -1) {
          result.push(that[i]);
        }
      }
      return result;
    }
  });

})(sc);
