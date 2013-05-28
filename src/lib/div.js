(function(sc) {
  "use strict";

  /**
   * Integer Division
   * @example
   *  (10).div(3);       // => 3
   *  [10,20,30].div(3); // => [ 3, 6, 10 ]
   */
  sc.register("div", {
    Number: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.div(num); }, this);
      }
      return Math.floor(this / num);
    },
    Array: function(num) {
      if (Array.isArray(num)) {
        return this.map(function(x, i) { return x.div(num.wrapAt(i)); });
      } else {
        return this.map(function(x) { return x.div(num); });
      }
    }
  });

})(sc);
