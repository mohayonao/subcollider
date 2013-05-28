(function(sc) {
  "use strict";

  sc.register("takeThese", {
    Array: function(func) {
      func = sc.func(func);
      var i = 0;
      while (i < this.length) {
        if (func(this[i], i)) {
          this.takeAt(i);
        } else {
          ++i;
        }
      }
      return this;
    }
  });

})(sc);
