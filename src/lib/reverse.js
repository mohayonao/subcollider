(function(sc) {
  "use strict";

  sc.register(["reverse", "sc_reverse"], {
    Array: function() {
      return this.slice().reverse();
    }
  });

})(sc);
