/**
 * Modulo
 * @example
 *  (10).opMod(3); // => 1
 *  [10,20,30].sc("%")(3); // => [ 1, 2, 0 ]
 */
sc.define(["opMod", "%"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.opMod(num); }, this);
    }
    return this % num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.opMod(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.opMod(num); });
    }
  }
});
