(function(sc) {
  "use strict";

  sc.register("isBoolean", {
    Number: function() {
      return false;
    },
    Boolean: function() {
      return true;
    },
    Array: function() {
      return false;
    },
    String: function() {
      return false;
    },
    Function: function() {
      return false;
    }
  });

})(sc);
