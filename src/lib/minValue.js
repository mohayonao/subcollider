(function(sc) {
  "use strict";

  sc.register(["minValue", "minItem"], {
    Array: function(func) {
      var i, imax, minValue, minElement, val;
      if (func) {
        func = sc.func(func);
        for (i = 0, imax = this.length; i < imax; ++i) {
          val = func(this[i], i);
          if (i === 0) {
            minValue = val;
            minElement = this[i];
          } else if (val < minValue) {
            minValue = val;
            minElement = this[i];
          }
        }
      } else {
        // optimized version if no function
        minElement = this[0];
        for (i = 1, imax = this.length; i < imax; ++i) {
          if (this[i] < minElement) {
            minElement = this[i];
          }
        }
      }
      return minElement;
    }
  });

})(sc);
