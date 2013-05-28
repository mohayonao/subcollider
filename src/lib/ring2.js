(function(sc) {
  "use strict";

  sc.register("ring2", {
    Number: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.ring2(num); }, this);
      }
      return this * num + this + num;
    },
    Array: function(num) {
      if (Array.isArray(num)) {
        return this.map(function(x, i) { return x.ring2(num.wrapAt(i)); });
      } else {
        return this.map(function(x) { return x.ring2(num); });
      }
    }
  });

})(sc);
