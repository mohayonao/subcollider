/**
 * Answer whether any item in *list* is contained in the receiver.
 * @arguments _(list)_
 * @example
 *  [1, 2, 3, 4].includesAny([4, 5]); // => true
 *  [1, 2, 3, 4].includesAny([5, 6]); // => false
 */
sc.define("includesAny", {
  Array: function(list) {
    for (var i = 0, imax = list.length; i < imax; ++i) {
      if (this.indexOf(list[i]) !== -1) { return true; }
    }
    return false;
  }
});

