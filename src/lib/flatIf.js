sc.define("flatIf", {
  Array: function(func) {
    func = sc.func(func);
    var list, i, imax;
    list = [];
    for (i = 0, imax = this.length; i < imax; ++i) {
      if (Array.isArray(this[i])) {
        if (func(this[i], i)) {
          list = list.concat(this[i].flatIf(func));
        } else {
          list.push(this[i]);
        }
      } else {
        list.push(this[i]);
      }
    }
    return list;
  }
});
