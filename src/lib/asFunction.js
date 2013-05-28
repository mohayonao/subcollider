(function(sc) {
  "use strict";

  var asFunction = function() {
    var that = this;
    return function() { return that; };
  };

  sc.register("asFunction", {
    Number: asFunction,
    Array : asFunction,
    String: asFunction,
    Function: function() {
      return this;
    }
  });

})(sc);
