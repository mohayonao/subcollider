sc.define("wrapSwap", {
  Array: function(i, j) {
    i = (i|0).iwrap(0, this.length-1);
    j = (j|0).iwrap(0, this.length-1);
    var t = this[i];
    this[i] = this[j];
    this[j] = t;
    return this;
  }
});
