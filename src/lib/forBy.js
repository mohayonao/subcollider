(function(sc) {
  "use strict";

  sc.register("forBy", {
    Number: function(endValue, stepValue, func) {
      var i = this, j = 0;
      if (stepValue > 0) {
        while (i <= endValue) { func(i, j++); i += stepValue; }
      } else {
        while (i >= endValue) { func(i, j++); i += stepValue; }
      }
      return this;
    }
  });

})(sc);
