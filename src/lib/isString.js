(function(sc) {
  "use strict";

  sc.register("isString", {
    Number: function() {
      return false;
    },
    Boolean: function() {
      return false;
    },
    Array: function() {
      return false;
    },
    String: function() {
      return true;
    },
    Function: function() {
      return false;
    }
  });

})(sc);
