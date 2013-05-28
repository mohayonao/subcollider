(function(sc) {
  "use strict";

  sc.register("indexInBetween", {
    Array: function(item) {
      var i = this.indexOfGreaterThan(item);
      if (i === -1) { return this.length - 1; }
      if (i ===  0) { return i; }
      var a = this[i-1];
      var b = this[i];
      var div = b - a;
      if (div === 0) { return i; }
      return ((item - a) / div) + i - 1;
    }
  });

})(sc);
