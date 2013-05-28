(function(sc) {
  "use strict";

  sc.register("foldSwap", {
    Array: function(i, j) {
      i = (i|0).fold(0, this.length-1);
      j = (j|0).fold(0, this.length-1);
      var t = this[i];
      this[i] = this[j];
      this[j] = t;
      return this;
    }
  });

})(sc);
