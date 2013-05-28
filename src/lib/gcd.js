(function(sc) {
  "use strict";

  sc.register("gcd", {
    Number: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.gcd(num); }, this);
      }
      var t, a =this|0, b=num|0;
      while (b !== 0) {
        t = a % b;
        a = b;
        b = t;
      }
      return a;
    },
    Array: function(num) {
      if (Array.isArray(num)) {
        return this.map(function(x, i) { return x.gcd(num.wrapAt(i)); });
      } else {
        return this.map(function(x) { return x.gcd(num); });
      }
    }
  });

})(sc);
