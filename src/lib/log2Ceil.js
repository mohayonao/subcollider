sc.define("log2Ceil", {
  Number: function() {
    if (this <= 0) {
      return Math.ceil(Math.log(0x100000000 + (this|0)) / Math.log(2));
    } else if (this > 0) {
      return Math.ceil(Math.log(this|0) / Math.log(2));
    }
  },
  Array: function() {
    return this.map(function(x) { return x.log2Ceil(); });
  }
});
