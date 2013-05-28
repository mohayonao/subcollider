(function(sc) {
  "use strict";

  var asString = function() {
    return "" + this;
  };

  sc.register("asString", {
    Number : asString,
    Boolean: asString,
    Array  : asString,
    String: function() {
      return this;
    },
    Function: asString
  });

})(sc);
