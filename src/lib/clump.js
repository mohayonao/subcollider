/**
 * Separates the collection into sub-collections by separating every groupSize elements.
 * @arguments _(groupSize)_
 * @example
 *   [1, 2, 3, 4, 5, 6, 7, 8].clump(3); // => [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8 ] ]
 */
sc.define("clump", {
  Array: function(groupSize) {
    var list, sublist, i, imax;
    list = [];
    sublist = [];
    for (i = 0, imax = this.length; i < imax; ++i) {
      sublist.push(this[i]);
      if (sublist.length >= groupSize) {
        list.push(sublist);
        sublist = [];
      }
    }
    if (sublist.length > 0) {
      list.push(sublist);
    }
    return list;
  }
});
