sc.define("lastForWhich", {
  Array: function(func) {
    func = sc.func(func);
    var prev = null;
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) {
        prev = this[i];
      } else {
        return prev;
      }
    }
    return prev;
  }
});
