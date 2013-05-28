(function(sc) {
  "use strict";

  sc.register("cpsoct", {
    Number: function() {
      return Math.log(Math.abs(this) * 1/440) * Math.LOG2E + 4.75;
    },
    Array: function() {
      return this.map(function(x) { return x.cpsoct(); });
    }
  });

})(sc);
