(function(sc) {
  "use strict";

  sc.register("lcm", {
    Number: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.lcm(num); }, this);
      }
      return Math.abs(this * num) / this.gcd(num);
    },
    Array: function(num) {
      if (Array.isArray(num)) {
        return this.map(function(x, i) { return x.lcm(num.wrapAt(i)); });
      } else {
        return this.map(function(x) { return x.lcm(num); });
      }
    }
  });

})(sc);
