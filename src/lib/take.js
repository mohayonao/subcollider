(function(sc) {
  "use strict";

  sc.register("take", {
    Array: function(item) {
      var index = this.indexOf(item);
      if (index !== -1) {
        return this.takeAt(index);
      }
    }
  });

})(sc);
