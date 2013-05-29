/**
 * Subtraction
 * @example
 *  (10).opSub(2); // => 8
 *  [10,20,30].sc("-")(10); // => [ 0, 10, 20 ]
 */
sc.define(["opSub", "-"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.opSub(num); }, this);
    }
    return this - num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.opSub(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.opSub(num); });
    }
  }
});
