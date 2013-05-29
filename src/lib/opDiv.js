/**
 * Division
 * @example
 *  (10).opDiv(2); // => 5
 *  [10,20,30].sc("/")(10); // => [ 1, 2, 3 ]
 */
sc.define(["opDiv", "/"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.opDiv(num); }, this);
    }
    return this / num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.opDiv(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.opDiv(num); });
    }
  }
});
