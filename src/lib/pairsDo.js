(function(sc) {
  "use strict";

  sc.register(["pairsDo", "keyValuesDo"], {
    Array: function(func) {
      func = sc.func(func);
      for (var i = 0, imax = this.length; i < imax; i += 2) {
        func(this[i], this[i+1], i);
      }
      return this;
    }
  });

})(sc);
