/**
 * @example
 *  Array.r(5); // => [ 0, 1, 2, 3, 4, 5 ]
 *  Array.r("2..5"); // => [ 2, 3, 4, 5 ]
 *  Array.r("1, 3..5"); // => [ 1, 3, 5 ]
 */
sc.define(["*range", "*r"], {
  Array: function(cmd) {
    if (typeof cmd === "string") {
      var items = cmd.split(/(?:\.\.|,)/);
      var first, second, last;
      if (items.length === 3) {
        first  = +items[0];
        second = +items[1];
        last   = +items[2];
        return (first).series(second, last);
      } else if (items.length === 2) {
        first  = +items[0];
        last   = +items[1];
        second = first + ((first < +last) ? 1 : -1);
        return (first).series(second, last);
      } else if (items.length === 1) {
        return Array.series((+items[0]) + 1);
      } else {
        return [];
      }
    } else if (typeof cmd === "number") {
      return Array.series(cmd + 1);
    }
  }
});
