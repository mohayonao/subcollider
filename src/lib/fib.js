/**
 * Fill an Array with a fibonacci series.
 * @arguments _(size [, a=0, b=1])_
 * @example
 *  Array.fib(5); // => [ 1, 1, 2, 3, 5 ]
 */
sc.define("*fib", {
  Array: function(size, x, y) {
    x = x === void 0 ? 0 : x;
    y = y === void 0 ? 1 : y;
    var a = new Array(size|0);
    for (var t, i = 0, imax = a.length; i < imax; i++) {
      a[i] = y;
      t = y;
      y = x + y;
      x = t;
    }
    return a;
  }
});

/**
 * @arguments _([a=0, b=1])_
 * @returns an array with a fibonacci series of this size beginning with a and b.
 * @example
 *  (5).fib(2, 32); // => [ 32, 34, 66, 100, 166 ]
 */
sc.define("fib", {
  Number: function(a, b) {
    if (Array.isArray(a) || Array.isArray(b)) {
      return [this,a,b].flop().map(function(items) {
        return items[0].geom(items[1], items[2]);
      });
    }
    return Array.fib(this, a, b);
  }
});
