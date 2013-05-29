sc.define("sumabs", {
  Array: function() {
    var sum = 0, elem;
    for (var i = 0, imax = this.length; i < imax; ++i) {
      elem = Array.isArray(this[i]) ? this[i][0] : this[i];
      sum = sum + Math.abs(elem);
    }
    return sum;
  }
});
