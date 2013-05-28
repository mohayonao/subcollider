(function(sc) {
  "use strict";

  sc.register("clump", {
    Array: function(groupSize) {
      var list, sublist, i, imax;
      list = [];
      sublist = [];
      for (i = 0, imax = this.length; i < imax; ++i) {
        sublist.push(this[i]);
        if (sublist.length >= groupSize) {
          list.push(sublist);
          sublist = [];
        }
      }
      if (sublist.length > 0) {
        list.push(sublist);
      }
      return list;
    }
  });

})(sc);
