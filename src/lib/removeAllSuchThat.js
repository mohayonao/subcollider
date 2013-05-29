/**
 * Remove all items in the receiver for which function answers True. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 */
sc.define("removeAllSuchThat", {
  Array: function(func) {
    func = sc.func(func);
    var remIndices = [], results = [], i, imax;
    for (i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) {
        remIndices.push(i);
        results.push(this[i]);
      }
    }
    for (i = remIndices.length; i--; ) {
      this.splice(remIndices[i], 1);
    }
    return results;
  }
});
