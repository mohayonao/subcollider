(function(sc) {
  "use strict";

  sc.register("removing", {
    Array: function(item) {
      var a = this.slice();
      a.remove(item);
      return a;
    }
  });

})(sc);
