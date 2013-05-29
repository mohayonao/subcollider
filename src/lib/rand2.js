/**
 * Fill an Array with random values in the range -*val* to +*val*.
 * @arguments _(size [, val=1])_
 * @example
 *  Array.rand2(8, 100);
 */
sc.define("*rand2", {
  Array: function(size, val) {
    val = val === void 0 ? 1 : val;
    var a = new Array(size|0);
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = val.rand2(val);
    }
    return a;
  }
});

/**
 * @returns a random number from -*this* to +*this*.
 */
sc.define("rand2", {
  Number: function() {
    return (Math.random() * 2 - 1) * this;
  },
  Array: function() {
    return this.map(function(x) { return x.rand2(); });
  }
});
