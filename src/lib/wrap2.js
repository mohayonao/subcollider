sc.define("wrap2", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.wrap2(num); }, this);
    }
    return this.wrap(-num, +num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.wrap2(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.wrap2(num); });
    }
  }
});
