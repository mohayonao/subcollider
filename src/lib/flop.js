/**
 * Invert rows and colums in a two dimensional Array (turn inside out).
 * @arguments _none_
 * @example
 *  [[1, 2, 3], [4, 5, 6]].flop(); // => [ [ 1, 4 ], [ 2, 5 ], [ 3, 6 ] ]
 */
sc.define("flop", {
  Array: function() {
    var maxsize = this.reduce(function(len, sublist) {
      return Math.max(len, Array.isArray(sublist) ? sublist.length : 1);
    }, 0);
    var a = new Array(maxsize), size = this.length;
    if (size === 0) {
      a[0] = [];
    } else {
      for (var i = 0; i < maxsize; ++i) {
        var sublist = a[i] = new Array(size);
        for (var j = 0; j < size; ++j) {
          sublist[j] = Array.isArray(this[j]) ? this[j].wrapAt(i) : this[j];
        }
      }
    }
    return a;
  }
});
