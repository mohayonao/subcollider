/**
 * Inserts the *item* into the contents of the receiver. This method may return a new Array.
 * @arguments _(index, item)_
 * @example
 *  [1, 2, 3, 4].insert(1, 999); // [ 1, 999, 3, 4 ]
 */
sc.define("insert", {
  Array: function(index, item) {
    index = Math.max(0, index|0);
    var ret = this.slice();
    ret.splice(index, 0, item);
    return ret;
  }
});
