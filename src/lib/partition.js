/**
 * randomly partition a number into parts of at least min size.
 * @arguments _([parts=2, min=1])_
 * @example
 *  (75).partition(8, 3);
 */
sc.define("partition", {
  Number: function(parts, min) {
    parts = typeof parts === "undefined" ? 2 : parts;
    min = typeof min === "undefined" ? 1 : min;
    var n = this - ((min - 1) * parts);
    var a = new Array(n-1);
    for (var i = 1; i <= n-1; ++i) {
      a[i-1] = i;
    }
    return a.scramble().keep(parts-1).sort(function(a, b) {
      return a - b;
    }).add(n).differentiate().opAdd(min-1);
  }
});
