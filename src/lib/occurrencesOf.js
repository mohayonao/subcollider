(function(sc) {
  "use strict";

  sc.register("occurrencesOf", {
    Array: function(item) {
      var sum = 0;
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (this[i] === item || this[i].equals(item)) { ++sum; }
      }
      return sum;
    }
  });

})(sc);
