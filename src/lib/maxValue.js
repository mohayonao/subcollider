(function(sc) {
  "use strict";

  sc.register(["maxValue", "maxItem"], {
    Array: function(func) {
      var i, imax, maxValue, maxElement, val;
      if (func) {
        func = sc.func(func);
        for (i = 0, imax = this.length; i < imax; ++i) {
          val = func(this[i], i);
          if (i === 0) {
            maxValue = val;
            maxElement = this[i];
          } else if (val > maxValue) {
            maxValue = val;
            maxElement = this[i];
          }
        }
      } else {
        // optimized version if no function
        val = this[0];
        maxValue = val;
        maxElement = this[0];
        for (i = 1, imax = this.length; i < imax; ++i) {
          val = this[i];
          if (val > maxValue) {
            maxValue = val;
            maxElement = this[i];
          }
        }
      }
      return maxElement;
    }
  });

})(sc);
