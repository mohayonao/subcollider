(function(sc) {
  "use strict";

  sc.register("removeAll", {
    Array: function(list) {
      for (var i = 0, imax = list.length; i < imax; ++i) {
        var index = this.indexOf(list[i]);
        if (index !== -1) {
          this.splice(index, 1);
        }
      }
      return this;
    }
  });

})(sc);
