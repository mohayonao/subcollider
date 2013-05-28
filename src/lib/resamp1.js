(function(sc) {
  "use strict";

  sc.register("resamp1", {
    Array: function(newSize) {
      var factor = (this.length - 1) / (newSize - 1);
      var a = new Array(newSize);
      for (var i = 0; i < newSize; ++i) {
        a[i] = this.blendAt(i * factor);
      }
      return a;
    }
  });

})(sc);
