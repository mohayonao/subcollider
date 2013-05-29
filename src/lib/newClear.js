/**
 * Creates a new instance with indexedSize indexable slots.
 * @arguments _(size)_
 */
sc.define("*newClear", {
  Array: function(size) {
    var a = new Array(size|0);
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = 0;
    }
    return a;
  }
});
