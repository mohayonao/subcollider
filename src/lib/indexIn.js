(function(sc) {
  "use strict";

  sc.register("indexIn", {
    Array: function(item) {
      var i, j = this.indexOfGreaterThan(item);
      if (j === -1) { return this.length - 1; }
      if (j ===  0) { return j; }
      i = j - 1;
      return ((item - this[i]) < (this[j] - item)) ? i : j;
    }
  });

})(sc);
