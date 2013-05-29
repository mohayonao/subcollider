/**
 * clips receiver to +/- aNumber
 * @arguments _([number=1])_
 * @example
 *  [ -0.6, -0.3, 0, 0.3, 0.6 ].clip2(0.5); // => [ -0.5, -0.3, 0, 0.3, 0.5 ]
 */
sc.define("clip2", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.clip2(num); }, this);
    }
    num = num === void 0 ? 1 : num;
    return this.clip(-num, +num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.clip2(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.clip2(num); });
    }
  }
});
