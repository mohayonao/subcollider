(function(sc) {
  "use strict";

  sc.register("sputter", {
    Array: function(probability, maxlen) {
      probability = probability === void 0 ? 0.25 : probability;
      maxlen      = maxlen      === void 0 ? 100  : maxlen|0;
      var a = [], i = 0, j = 0, size = this.length;
      while (i < size && j < maxlen) {
        a[j++] = this[i];
        if (probability < Math.random()) { i += 1; }
      }
      return a;
    }
  });

})(sc);
