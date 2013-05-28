(function(sc) {
  "use strict";

  sc.register("clip2", {
    Number: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.clip2(num); }, this);
      }
      return this.clip(-num, +num);
    },
    Array: function(num) {
      if (Array.isArray(num)) {
        return this.map(function(x, i) { return x.clip2(num.wrapAt(i)); });
      } else {
        return this.map(function(x) { return x.clip2(num); });
      }
    }
  });

})(sc);
