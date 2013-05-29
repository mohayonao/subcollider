sc.define("uniq", {
  Array: function() {
    var result = [], i, imax;
    for (i = 0, imax = this.length; i < imax; ++i) {
      if (result.indexOf(this[i]) === -1) {
        result.push(this[i]);
      }
    }
    return result;
  }
});
