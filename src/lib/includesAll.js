/**
 * Answer whether all items in *list* are contained in the receiver.
 * @arguments _(list)_
 * @example
 *  [1, 2, 3, 4].includesAll([2, 4]); // => true
 *  [1, 2, 3, 4].includesAll([4, 5]); // => false
 */
sc.define("includesAll", {
  Array: function(list) {
    for (var i = 0, imax = list.length; i < imax; ++i) {
      if (this.indexOf(list[i]) === -1) { return false; }
    }
    return true;
  }
});
