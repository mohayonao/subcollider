(function(sc) {
  "use strict";

  /**
   * Arccosine
   */
  sc.register("acos", {
    Number: function() {
      return Math.acos(this);
    },
    Array: function() {
      return this.map(function(x) { return x.acos(); });
    },
    Function: function() {
      var func = this;
      return function() {
        return func.apply(func, arguments).acos();
      };
    }
  });

})(sc);
