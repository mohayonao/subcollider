sc.define("hypotApx", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.hypotApx(num); }, this);
    }
    var x = Math.abs(this), y = Math.abs(num);
    var minxy = Math.min(x, y);
    return x + y - (Math.sqrt(2) - 1) * minxy;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.hypotApx(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.hypotApx(num); });
    }
  }
});
