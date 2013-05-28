(function(sc) {
  "use strict";

  sc.register("bilinrand", {
    Number: function() {
      return (Math.random() - Math.random()) * this;
    },
    Array: function() {
      return this.map(function(x) { return x.bilinrand(); });
    }
  });

})(sc);
