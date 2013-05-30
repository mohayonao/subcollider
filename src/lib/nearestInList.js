/**
 * the value in the list closest to this
 * @arguments _(list)_
 * @example
 *  l = [0, 0.5, 0.9, 1];
 *  sc.Range("0, 0.1..1").collect(function(i) { return i.nearestInList(l); });
 *  // => [ 0, 0, 0, 0.5, 0.5, 0.5, 0.5, 0.9, 0.9, 0.9, 1 ]
 */
sc.define("nearestInList", {
  Number: function(list) {
    return list.performNearestInList(this);
  },
  Array: function(list) {
    // collection is sorted
    return this.map(function(item) {
      return list.at(list.indexIn(item));
    });
  }
});
