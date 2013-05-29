/**
 * Addition
 * @example
 *  (10).opAdd(2); // => 12
 *  [10,20,30].sc("+")(10); // => [ 20, 30, 40 ]
 */
sc.define(["opAdd", "+"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.opAdd(num); }, this);
    }
    return this + num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.opAdd(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.opAdd(num); });
    }
  }
});
