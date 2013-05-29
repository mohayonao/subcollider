/**
 * Fill an Array with a geometric series.
 * @arguments (size [, start=1, grow=2])
 * @example
 *  Array.geom(5, 1, 3) // => [ 1, 3, 9, 27, 81 ]
 */
sc.define("*geom", {
  Array: function(size, start, grow) {
    start = start === void 0 ? 1 : start;
    grow  = grow  === void 0 ? 2 : grow;
    var a = new Array(size|0);
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = start;
      start *= grow;
    }
    return a;
  }
});

/**
 * @arguments (start, grow)
 * @returns an array with a geometric series of this size from start.
 * @example
 *  (5).geom(1, 3) // => [ 1, 3, 9, 27, 81 ]
 */
sc.define("geom", {
  Number: function(start, grow) {
    if (Array.isArray(start) || Array.isArray(grow)) {
      return [this,start,grow].flop().map(function(items) {
        return items[0].geom(items[1], items[2]);
      });
    }
    return Array.geom(this, start, grow);
  }
});
