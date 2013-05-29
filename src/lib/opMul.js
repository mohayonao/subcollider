/**
 * Multiplication  
 * @example
 *  (10).opMul(2); // => 20
 *  [10,20,30].sc("*")(10); // => [ 100, 200, 300 ]
 */
sc.define(["opMul", "*"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.opMul(num); }, this);
    }
    return this * num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.opMul(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.opMul(num); });
    }
  }
});
