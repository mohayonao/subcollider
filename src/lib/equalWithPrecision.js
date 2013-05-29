sc.define("equalWithPrecision", {
  Number: function(that, precision) {
    if (Array.isArray(that) || Array.isArray(precision)) {
      return [this,that,precision].flop().map(function(items) {
        return items[0].equalWithPrecision(items[1],items[2]);
      });
    }
    precision = precision === void 0 ? 0.0001 : precision;
    return Math.abs(this - that) < precision;
  },
  Array: function(that, precision) {
    if (Array.isArray(that)) {
      return this.map(function(x, i) { return x.equalWithPrecision(this.wrapAt(i), precision); });
    } else {
      return this.map(function(x) { return x.equalWithPrecision(that); });
    }
  }
});
