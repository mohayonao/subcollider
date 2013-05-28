(function(sc) {
  "use strict";

  sc.register("isFunction", {
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
      return false;
    },
    Function: function() {
      return true;
    }
  });

})(sc);
