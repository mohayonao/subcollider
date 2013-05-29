/**
 * Fill an Array with an arithmetic series.
 * @arguments (size [, start=0, step=1])
 * @example
 *  Array.series(5, 10, 2); // => [ 10, 12, 14, 16, 18 ]
 */
sc.define("*series", {
  Array: function(size, start, step) {
    start = start === void 0 ? 0 : start;
    step  = step  === void 0 ? 1 : step;
    var a = new Array(size|0);
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = start + (step * i);
    }
    return a;
  }
});

/**
 * return an artithmetic series from this over second to last.
 * @arguments (second, last)
 * @example
 *  (5).series(7, 10); // => [ 5, 7, 9 ]
 */
sc.define("series", {
  Number: function(second, last) {
    var step = second - this;
    var size = (Math.floor((last - this) / step + 0.001)|0) + 1;
    return Array.series(size, this, step);
  }
});
