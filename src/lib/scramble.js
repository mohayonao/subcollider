(function(sc) {
  "use strict";

  sc.register(["scramble", "shuffle"], {
    Array: function() {
      var a = this.slice(0);
      var i, j, t, m, k = a.length;
      for (i = 0, m = k; i < k - 1; i++, m--) {
        j = i + ((Math.random() * m)|0);
        t = a[i];
        a[i] = a[j];
        a[j] = t;
      }
      return a;
    }
  });

})(sc);
