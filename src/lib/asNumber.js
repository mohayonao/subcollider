(function(sc) {
  "use strict";

  sc.register("asNumber", {
    Number: function() {
      return this;
    },
    Boolean: function() {
      return this ? 1 : 0;
    },
    Array: function() {
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (typeof this[i] === "number") { return this[i]; }
      }
      return 0;
    },
    String: function() {
      return isNaN(+this) ? 0 : +this;
    },
    Function: function() {
      return 0;
    }
  });

})(sc);
