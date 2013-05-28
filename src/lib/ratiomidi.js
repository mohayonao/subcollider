(function(sc) {
  "use strict";

  sc.register("ratiomidi", {
    Number: function() {
      return Math.log(Math.abs(this)) * Math.LOG2E * 12;
    },
    Array: function() {
      return this.map(function(x) { return x.ratiomidi(); });
    }
  });

})(sc);
