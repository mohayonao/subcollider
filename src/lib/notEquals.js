(function(sc) {
  "use strict";

  sc.register(["notEquals", "!="], {
    Number: function(arg) {
      return this !== arg;
    },
    Array: function(arg) {
      return !this.equals(arg);
    },
    String: function(arg) {
      return this !== arg;
    },
    Function: function(arg) {
      return this !== arg;
    }
  });

})(sc);
