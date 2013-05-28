(function(sc) {
  "use strict";

  sc.register("clumps", {
    Array: function(groupSizeList) {
      var index, list, sublist, subSize, i, imax;
      index = 0;
      list = [];
      subSize = groupSizeList[0];
      sublist = [];
      for (i = 0, imax = this.length; i < imax; ++i) {
        sublist.push(this[i]);
        if (sublist.length >= subSize) {
          index += 1;
          list.push(sublist);
          subSize = groupSizeList[index % groupSizeList.length];
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
