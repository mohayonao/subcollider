
sc.define("thresh", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.thresh(num); }, this);
    }
    return this < num ? 0 : this;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.thresh(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.thresh(num); });
    }
  }
});
