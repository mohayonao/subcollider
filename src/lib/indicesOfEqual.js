/**
 * Same as `indicesOf`, but use `equals` method.
 * @arguments _(item [, offset=0])_
 * @example
 *  [[7], [8], [5], [6], 7, 6, [7], 9].indicesOfEqual([7]); // => [ 0, 6 ]
 */
sc.define("indicesOfEqual", {
  Array: function(item, offset) {
    offset = offset === void 0 ? 0 : offset|0;
    var a = [];
    for (var i = offset, imax = this.length; i < imax; i++) {
      if (this[i].equals(item)) { a.push(i); }
    }
    return a;
  }
});
