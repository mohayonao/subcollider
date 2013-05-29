/**
 * Return an array of indices of things in the collection that equal the *item*, or [] if not found.
 * @arguments _(item [, offset=0])_
 * @example
 *  [7, 8, 7, 6, 5, 6, 7, 6, 7, 8, 9].indicesOf(7); // => [ 0, 2, 6, 8 ]
 */
sc.define("indicesOf", {
  Array: function(item, offset) {
    offset = offset === void 0 ? 0 : offset|0;
    var a = [];
    for (var i = offset, imax = this.length; i < imax; i++) {
      if (this[i] === item) { a.push(i); }
    }
    return a;
  }
});
