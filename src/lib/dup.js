(function(sc) {
  "use strict";

  var dup = function(n) {
    n = n === void 0 ? 2 : n;
    var a = new Array(n|0);
    for (var i = 0, imax = a.length; i < imax; ++i) {
      a[i] = this;
    }
    return a;
  };

  sc.register("dup", {
    Number : dup,
    Boolean: dup,
    Array  : function(n) {
      n = n === void 0 ? 2 : n;
      var a = new Array(n|0);
      for (var i = 0, imax = a.length; i < imax; ++i) {
        a[i] = this.slice();
      }
      return a;
    },
    String: dup,
    Function: function(n) {
      n = n === void 0 ? 2 : n;
      return Array.fill(n|0, this);
    }
  });

})(sc);
