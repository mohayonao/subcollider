(function(sc) {
  "use strict";

  sc.register("excess", {
    Number: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.excess(num); }, this);
      }
      return this - this.clip(-num, +num);
    },
    Array: function(num) {
      if (Array.isArray(num)) {
        return this.map(function(x, i) { return x.excess(num.wrapAt(i)); });
      } else {
        return this.map(function(x) { return x.excess(num); });
      }
    }
  });

})(sc);
