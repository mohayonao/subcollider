(function(sc) {
  "use strict";

  sc.register("size", {
    Number: function() {
      return 0;
    },
    Boolean: function() {
      return 0;
    },
    Array: function() {
      return this.length;
    },
    String: function() {
      return this.length;
    },
    Function: function() {
      return 0;
    }
  });

})(sc);
