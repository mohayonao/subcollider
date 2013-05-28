(function(sc) {
  "use strict";

  sc.register("differentiate", {
    Array: function() {
      var prev = 0;
      return this.map(function(item) {
        var ret = item - prev;
        prev = item;
        return ret;
      });
    }
  });

})(sc);
