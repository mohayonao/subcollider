/**
 * Same as `at`, but values for *index* greater than the size of the Array will be folded back.
 * @arguments _(index)_
 * @example
 *  [ 1, 2, 3 ].foldAt(5); // => 2
 *  [ 1, 2, 3 ].foldAt([ 0, 1, 2, 3 ]); // => [ 1, 2, 3, 2 ]
 */
sc.define(["foldAt", "@|@"], {
  Array: function(index) {
    if (Array.isArray(index)) {
      return index.map(function(index) {
        return this.foldAt(index);
      }, this);
    }
    return this[(index|0).fold(0, this.length-1)];
  }
});
