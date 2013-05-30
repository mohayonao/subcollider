/**
 * (a - b).abs()
 * @arguments _(number)_
 * @example
 *  sc.absdif(10, 15); // => 5
 */
sc.define("absdif", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.absdif(num); }, this);
    }
    return Math.abs(this - num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.absdif(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.absdif(num); });
    }
  }
});
