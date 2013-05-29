sc.define(["every", "sc_every"], {
  Array: function(func) {
    func = sc.func(func);
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (!func(this[i], i)) { return false; }
    }
    return true;
  }
});
