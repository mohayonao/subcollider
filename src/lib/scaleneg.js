(function(sc) {
  "use strict";

  sc.register("scaleneg", {
    Number: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.scaleneg(num); }, this);
      }
      num = 0.5 * num + 0.5;
      return (Math.abs(this) - this) * num + this;
    },
    Array: function(num) {
      if (Array.isArray(num)) {
        return this.map(function(x, i) { return x.scaleneg(num.wrapAt(i)); });
      } else {
        return this.map(function(x) { return x.scaleneg(num); });
      }
    }
  });

})(sc);
