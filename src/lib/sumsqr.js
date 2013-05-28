(function(sc) {
  "use strict";

  sc.register("sumsqr", {
    Number: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.sumsqr(num); }, this);
      }
      return this * this + num * num;
    },
    Array: function(num) {
      if (Array.isArray(num)) {
        return this.map(function(x, i) { return x.sumsqr(num.wrapAt(i)); });
      } else {
        return this.map(function(x) { return x.sumsqr(num); });
      }
    }
  });

})(sc);
