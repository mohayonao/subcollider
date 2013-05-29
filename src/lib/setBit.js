/**
 * set nth bit to zero (bool = false) or one (bool = true)
 * @arguments _(number, bool)_
 */
sc.define("setBit", {
  Number: function(num, bool) {
    if (Array.isArray(num)) {
      var that = this;
      for (var i = 0, imax = num.length; i < imax; ++i) {
        that = that.setBit(num[i], bool);
      }
      return that;
    }
    bool = bool === void 0 ? true : !!bool;
    if (bool) {
      return this | (1 << num);
    } else {
      return this & ~(1 << num);
    }
  },
  Array: function(num, bool) {
    return this.map(function(x) { return x.setBit(num, bool); });
  }
});
