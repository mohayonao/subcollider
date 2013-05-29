/**
 * Remove all items in array from the receiver.
 * @arguments _(list)_
 */
sc.define("removeAll", {
  Array: function(list) {
    for (var i = 0, imax = list.length; i < imax; ++i) {
      var index = this.indexOf(list[i]);
      if (index !== -1) {
        this.splice(index, 1);
      }
    }
    return this;
  }
});
