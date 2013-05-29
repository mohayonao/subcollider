sc.define("delimit", {
  Array: function(func) {
    var list, sublist, i, imax;
    func = func === void 0 ? sc.func(true) : sc.func(func);
    list = [];
    sublist = [];
    for (i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) {
        list.push(sublist);
        sublist = [];
      } else {
        sublist.push(this[i]);
      }
    }
    list.push(sublist);
    return list;
  }
});
