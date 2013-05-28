(function(sc) {
  "use strict";

  /**
   * (a - b).abs()
   * @example
   *  (10).absdif(15); // => 5
   */
  sc.register("absdif", {
    Number: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.absdif(num); }, this);
      }
      return Math.abs(this - num);
    },
    Array: function(num) {
      if (Array.isArray(num)) {
        return this.map(function(x, i) { return x.absdif(num.wrapAt(i)); });
      } else {
        return this.map(function(x) { return x.absdif(num); });
      }
    },
    Function: function() {
      var func = this;
      return function() {
        return func.apply(func, arguments).absdif();
      };
    }
  });

})(sc);
