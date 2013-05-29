/**
 * Return a new Array consisting of the values starting at *first*, then every step of the distance between *first* and *second*, up until *last*.
 * @arguments _(first, second, last)_
 * @example
 *   [1, 2, 3, 4, 5, 6].copySeries(0, 2, 5); // => [ 1, 3, 5 ]
 */
sc.define("copySeries", {
  Array: function(first, second, last) {
    return this.at(first.series(second, last));
  }
});
