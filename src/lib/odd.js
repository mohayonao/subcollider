(function(sc) {
  "use strict";

  sc.register("odd", {
    Number: function() {
      return (this & 1) === 1;
    },
    Array: function() {
      return this.map(function(x) { return x.odd(); });
    }
  });

})(sc);
