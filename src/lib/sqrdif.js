(function(sc) {
  "use strict";

  sc.register("sqrdif", {
    Number: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.sqrdif(num); }, this);
      }
      var z = this - num;
      return z * z;
    },
    Array: function(num) {
      if (Array.isArray(num)) {
        return this.map(function(x, i) { return x.sqrdif(num.wrapAt(i)); });
      } else {
        return this.map(function(x) { return x.sqrdif(num); });
      }
    }
  });

})(sc);
