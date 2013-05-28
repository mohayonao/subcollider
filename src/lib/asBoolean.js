(function(sc) {
  "use strict";

  sc.register("asBoolean", {
    Number: function() {
      return this !== 0;
    },
    Boolean: function() {
      return this;
    },
    Array: function() {
      return this.length > 0;
    },
    String: function() {
      return this === "true";
    },
    Function: function() {
      return true;
    }
  });

})(sc);
