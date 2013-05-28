(function(sc) {
  "use strict";

  var copyFromStart = function(end) {
    if (Array.isArray(end)) {
      return end.map(function(end) {
        return this.copyFromStart(end);
      }, this);
    }
    end = Math.max(0, end|0);
    return this.slice(0, end + 1);
  };

  sc.register("copyFromStart", {
    Array : copyFromStart,
    String: copyFromStart
  });

})(sc);
