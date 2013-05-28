(function(sc) {
  "use strict";

  sc.register("hypot", {
    Number: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.hypot(num); }, this);
      }
      return Math.sqrt((this * this) + (num * num));
    },
    Array: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.hypotApx(num); }, this);
      }
      var x = Math.abs(this), y = Math.abs(num);
      var minxy = Math.min(x, y);
      return x + y - (Math.sqrt(2) - 1) * minxy;
    }
  });

})(sc);
