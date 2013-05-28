(function(sc) {
  "use strict";

  sc.register("ampdb", {
    Number: function() {
      return Math.log(this) * Math.LOG10E * 20;
    },
    Array: function() {
      return this.map(function(x) { return x.ampdb(); });
    }
  });

})(sc);
