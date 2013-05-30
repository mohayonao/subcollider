/**
 * Same as `at`, but values for index greater than the size of the Array will be wrapped around to 0.
 * @example
 *  [ 1, 2, 3 ].wrapAt(13); // => 2
 *  [ 1, 2, 3 ].wrapAt([ 0, 1, 2, 3 ]); // => [ 1, 2, 3, 1 ]
 */
sc.define(["wrapAt", "@@"], {
  Array: function(index) {
    if (Array.isArray(index)) {
      return index.map(function(index) {
        return this.wrapAt(index);
      }, this);
    }
    return this[(index|0).iwrap(0, this.length-1)];
  }
});
