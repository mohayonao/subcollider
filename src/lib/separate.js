(function(sc) {
  "use strict";

  sc.register("separate", {
    Array: function(func) {
      var list, sublist;
      func = func === void 0 ? sc.func(true) : sc.func(func);
      list = [];
      sublist = [];
      this.doAdjacentPairs(function(a, b, i) {
        sublist.push(a);
        if (func(a, b, i)) {
          list.push(sublist);
          sublist = [];
        }
      });
      if (this.length > 0) {
        sublist.push(this[this.length-1]);
      }
      list.push(sublist);
      return list;
    }
  });

})(sc);
