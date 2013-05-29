/**
 * Returns a new Array whose elements are the nthPermutation of the elements of the receiver.
 * @arguments _(nthPermutation)_
 */
sc.define("permute", {
  Array: function(nthPermutation) {
    var obj1, obj2, i, j, z, size, t;
    if (Array.isArray(nthPermutation)) {
      return nthPermutation.map(function(nthPermutation) {
        return this.permute(nthPermutation);
      }, this);
    }
    obj1 = this;
    obj2 = this.slice();
    size = this.length;
    z = nthPermutation|0;
    for (i = 0; i < size-1; ++i) {
      j = i + z % (size-i);
      z = (z / (size-i))|0;
      t = obj2[i];
      obj2[i] = obj2[j];
      obj2[j] = t;
    }
    return obj2;
  }
});
