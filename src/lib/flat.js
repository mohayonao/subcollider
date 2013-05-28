(function(sc) {
  "use strict";

  var flat = function(that, list) {
    var i, imax;
    for (i = 0, imax = that.length; i < imax; ++i) {
      if (Array.isArray(that[i])) {
        list = flat(that[i], list);
      } else {
        list.push(that[i]);
      }
    }
    return list;
  };

  sc.register("flat", {
    Array: function() {
      return flat(this, []);
    }
  });

})(sc);
