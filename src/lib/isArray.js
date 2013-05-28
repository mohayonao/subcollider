(function(sc) {
  "use strict";

  sc.register("isArray", {
    Number: function() {
      return false;
    },
    Boolean: function() {
      return false;
    },
    Array: function() {
      return true;
    },
    String: function() {
      return false;
    },
    Function: function() {
      return false;
    }
  });

})(sc);
