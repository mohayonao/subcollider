(function(sc) {
  "use strict";

  var copyToEnd = function(start) {
    if (Array.isArray(start)) {
      return start.map(function(start) {
        return this.copyToEnd(start);
      }, this);
    }
    start = Math.max(0, start|0);
    return this.slice(start);
  };

  sc.register("copyToEnd", {
    Array : copyToEnd,
    String: copyToEnd
  });

})(sc);
