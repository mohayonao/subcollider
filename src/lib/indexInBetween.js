/**
 * Returns a linearly interpolated float index for the value (collection must be sorted). Inverse operation is `blendAt`.
 * @arguments _(item)_
 * @example
 *  [2, 3, 5, 6].indexInBetween(5.2); // => 2.2
 */
sc.define("indexInBetween", {
  Array: function(item) {
    var i = this.indexOfGreaterThan(item);
    if (i === -1) { return this.length - 1; }
    if (i ===  0) { return i; }
    var a = this[i-1];
    var b = this[i];
    var div = b - a;
    if (div === 0) { return i; }
    return ((item - a) / div) + i - 1;
  }
});
