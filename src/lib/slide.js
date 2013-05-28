(function(sc) {
  "use strict";

  sc.register("slide", {
    Array: function(windowLength, stepSize) {
      var obj1, obj2, numslots, numwin, h, i, j, k, m, n;
      windowLength = windowLength === void 0 ? 3 : windowLength;
      stepSize     = stepSize     === void 0 ? 1 : stepSize;
      obj1 = this;
      obj2 = [];
      m = windowLength;
      n = stepSize;
      numwin = ((this.length + n - m) / n)|0;
      numslots = numwin * m;
      for (i=h=k=0; i<numwin; ++i,h+=n) {
        for (j=h; j<m+h; ++j) {
          obj2[k++] = obj1[j];
        }
      }
      return obj2;
    }
  });

})(sc);
