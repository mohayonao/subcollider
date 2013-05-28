(function(sc) {
  "use strict";

  sc.register("copy", {
    Number: function() {
      return this;
    },
    Boolean: function() {
      return this;
    },
    Array: function() {
      return this.slice();
    },
    String: function() {
      return this;
    },
    Function: function() {
      return this;
    }
  });

})(sc);
