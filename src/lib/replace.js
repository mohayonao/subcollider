(function(sc) {
  "use strict";

  sc.register("replace", {
    Array: function(find, replace) {
      var index, out = [], array = this;
      find = find.asArray();
      replace = replace.asArray();
      while ((index = array.find(find)) !== -1) {
        out = out.concat(array.keep(index), replace);
        array = array.drop(index + find.length);
      }
      return out.concat(array);
    }
  });

})(sc);
