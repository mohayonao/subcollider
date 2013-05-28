(function(sc) {
  "use strict";

  sc.register("softclip", {
    Number: function() {
      var absx = Math.abs(this);
      return absx <= 0.5 ? this : (absx - 0.25) / this;
    },
    Array: function() {
      return this.map(function(x) { return x.softclip(); });
    }
  });

})(sc);
