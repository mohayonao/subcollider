sc.define("lastIndexForWhich", {
  Array: function(func) {
    func = sc.func(func);
    var prev = -1;
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) {
        prev = i;
      } else {
        return prev;
      }
    }
    return prev;
  }
});
