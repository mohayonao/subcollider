/**
 * Return the index of something in the collection that equals the *item*, or -1 if not found.
 * @arguments _(item [, offset=0])_
 * @example
 *  [[3], [4], [5]].indexOfEqual([5]); // => 2
 */
sc.define("indexOfEqual", {
  Array: function(item, offset) {
    offset = offset === void 0 ? 0 : offset|0;
    for (var i = offset, imax = this.length; i < imax; i++) {
      if (this[i].equals(item)) { return i; }
    }
    return -1;
  }
});
