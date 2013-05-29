/**
 * Adds an item to an Array if there is space. This method may return a new Array.
 * @arguments _(item)_
 * @example
 *  [1,2,3].add(4); // => [ 1, 2, 3, 4 ]
 */
sc.define("add", {
  Array: function(item) {
    var ret = this.slice();
    ret.push(item);
    return ret;
  }
});
