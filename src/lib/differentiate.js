/**
 * Returns an array with the pairwise difference between all elements.
 * @arguments _none_
 * @example
 *   [3, 4, 1, 1].differentiate(); // => [ 3, 1, -3, 0 ]
 */
sc.define("differentiate", {
  Array: function() {
    var prev = 0;
    return this.map(function(item) {
      var ret = item - prev;
      prev = item;
      return ret;
    });
  }
});
