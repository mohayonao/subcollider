/**
 * Separates the collection into sub-collections by separating elements into groupings whose size is given by integers in the groupSizeList.
 * @arguments _(groupSizeList)_
 * @example
 *   [1, 2, 3, 4, 5, 6, 7, 8].clumps([1, 2]);
 *   // => [ [ 1 ], [ 2, 3 ], [ 4 ], [ 5, 6 ], [ 7 ], [ 8 ] ]
 */
sc.define("clumps", {
  Array: function(groupSizeList) {
    var index, list, sublist, subSize, i, imax;
    index = 0;
    list = [];
    subSize = groupSizeList[0];
    sublist = [];
    for (i = 0, imax = this.length; i < imax; ++i) {
      sublist.push(this[i]);
      if (sublist.length >= subSize) {
        index += 1;
        list.push(sublist);
        subSize = groupSizeList[index % groupSizeList.length];
        sublist = [];
      }
    }
    if (sublist.length > 0) {
      list.push(sublist);
    }
    return list;
  }
});
