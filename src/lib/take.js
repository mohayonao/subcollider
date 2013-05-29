/**
 * Remove and return *item* from collection. The last item in the collection will move to occupy the vacated slot (and the collection size decreases by one).
 * @arguments _(item)_
 * @example
 *  a =  [11, 12, 13, 14, 15];
 *  a.take(12); // => 12
 *  a; => [ 11, 15, 13, 14 ]
 */
sc.define("take", {
  Array: function(item) {
    var index = this.indexOf(item);
    if (index !== -1) {
      return this.takeAt(index);
    }
  }
});
