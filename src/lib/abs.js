(function(sc) {
  "use strict";

  /**
   * absolute value
   * @example
   *  (-10).abs(); // => 10
   *  [ -2, -1, 0, 1, 2 ].abs(); // => [ 2, 1, 0, 1, 2 ]
   */
  sc.register("abs", {
    Number: function() {
      return Math.abs(this);
    },
    Array: function() {
      return this.map(function(x) { return x.abs(); });
    },
    Function: function() {
      var func = this;
      return function() {
        return func.apply(func, arguments).abs();
      };
    }
  });

})(sc);
