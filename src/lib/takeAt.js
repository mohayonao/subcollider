(function(sc) {
  "use strict";

  sc.register("takeAt", {
    Array: function(index) {
      index |= 0;
      if (0 <= index && index < this.length) {
        var retVal = this[index];
        var instead = this.pop();
        if (index !== this.length) {
          this[index] = instead;
        }
        return retVal;
      }
    }
  });

})(sc);
