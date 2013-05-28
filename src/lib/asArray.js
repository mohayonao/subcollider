(function(sc) {
  "use strict";

  var asArray = function() {
    return [this];
  };

  sc.register("asArray", {
    Number : asArray,
    Boolean: asArray,
    Array: function() {
      return this;
    },
    String  : asArray,
    Function: asArray
  });

})(sc);
