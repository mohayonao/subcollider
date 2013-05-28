(function(sc) {
  "use strict";

  var fillND = function(dimensions, func, args) {
    var n, a, argIndex, i;
    n = dimensions[0];
    a = [];
    argIndex = args.length;
    args = args.concat(0);
    if (dimensions.length <= 1) {
      for (i = 0; i < n; ++i) {
        args[argIndex] = i;
        a.push(func.apply(null, args));
      }
    } else {
      dimensions = dimensions.slice(1);
      for (i = 0; i < n; ++i) {
        args[argIndex] = i;
        a.push(fillND(dimensions, func, args));
      }
    }
    return a;
  };

  sc.register("*fillND", {
    Array: function(dimensions, func) {
      return fillND(dimensions, sc.func(func), []);
    }
  });

})(sc);
