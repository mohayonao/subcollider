(function(sc) {
  "use strict";

  sc.register(["greaterThan", ">="], {
    Number: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.greaterThan(num); }, this);
      }
      return this >= num;
    },
    Array: function(num) {
      if (Array.isArray(num)) {
        return this.map(function(x, i) { return x.greaterThan(num.wrapAt(i)); });
      } else {
        return this.map(function(x) { return x.greaterThan(num); });
      }
    }
  });

})(sc);
