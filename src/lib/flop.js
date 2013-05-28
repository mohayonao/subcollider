(function(sc) {
  "use strict";

  sc.register("flop", {
    Array: function() {
      var maxsize = this.reduce(function(len, sublist) {
        return Math.max(len, Array.isArray(sublist) ? sublist.length : 1);
      }, 0);
      var a = new Array(maxsize), size = this.length;
      if (size === 0) {
        a[0] = [];
      } else {
        for (var i = 0; i < maxsize; ++i) {
          var sublist = a[i] = new Array(size);
          for (var j = 0; j < size; ++j) {
            sublist[j] = Array.isArray(this[j]) ? this[j].wrapAt(i) : this[j];
          }
        }
      }
      return a;
    }
  });

})(sc);
