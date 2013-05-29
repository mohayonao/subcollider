/**
 * Remove all occurrences of the items in array from the receiver.
 * @arguments _(list)_
 */
sc.define("removeEvery", {
  Array: function(list) {
    var index;
    for (var i = 0, imax = list.length; i < imax; ++i) {
      do {
        index = this.indexOf(list[i]);
        if (index !== -1) {
          this.splice(index, 1);
        }
      } while (index !== -1);
    }
    return this;
  }
});
