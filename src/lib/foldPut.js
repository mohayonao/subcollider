/**
 * Same as `put`, but values for index greater than the size of the Array will be folded back.
 * @arguments _(index, item)_
 */
sc.define("foldPut", {
  Array: function(index, item) {
    if (typeof index === "number") {
      this[index.fold(0, this.length-1)] = item;
    } else if (Array.isArray(index)) {
      index.forEach(function(index) {
        this.foldPut(index, item);
      }, this);
    }
    return this;
  }
});
