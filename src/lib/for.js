(function(sc) {
  "use strict";

  sc.register("for", {
    Number: function(endValue, func) {
      func = sc.func(func);
      var i = this, j = 0;
      while (i <= endValue) { func(i++, j++); }
      return this;
    }
  });

})(sc);
