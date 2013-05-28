(function(sc) {
  "use strict";

  sc.register("reverseDo", {
    Number: function(func) {
      func = sc.func(func);
      var i = this|0, j = 0;
      while (--i >= 0) {
        func(i, j++);
      }
      return this;
    }
  });

})(sc);
