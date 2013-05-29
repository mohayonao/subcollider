sc.define(["bitNot", "~"], {
  Number: function() {
    return ~this;
  },
  Array: function() {
    return this.map(function(x) { return x.bitNot(); });
  }
});
