/**
 * Same as `at`, but values for index greater than the size of the Array will be clipped to the last index.
 * @arguments _(index)_
 * @example
 *  [ 1, 2, 3 ].clipAt(13); // => 3
 *  [ 1, 2, 3 ].clipAt([ 0, 1, 2, 3 ]); // => [ 1, 2, 3, 3 ]
 */
sc.define(["clipAt", "|@|"], {
  Array: function(index) {
    if (Array.isArray(index)) {
      return index.map(function(index) {
        return this.clipAt(index);
      }, this);
    }
    return this[(index|0).clip(0, this.length-1)];
  }
});
