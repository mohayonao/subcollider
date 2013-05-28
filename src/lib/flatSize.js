(function(sc) {
  "use strict";

  var flatSize = function(list) {
    if (!Array.isArray(list)) {
      return 1;
    }
    var size = 0;
    for (var i = 0, imax = list.length; i < imax; ++i) {
      size += flatSize(list[i]);
    }
    return size;
  };

  sc.register("flatSize", {
    Array: function() {
      return flatSize(this);
    }
  });

})(sc);
