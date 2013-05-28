(function(sc) {
  "use strict";

  sc.register("isNumber", {
    Number: function() {
      return true;
    },
    Boolean: function() {
      return false;
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
