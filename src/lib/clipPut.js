/**
 * Same as `put`, but values for index greater than the size of the Array will be clipped to the last index.
 * @arguments _(index, item)_
 */
sc.define("clipPut", {
  Array: function(index, item) {
    if (typeof index === "number") {
      this[index.clip(0, this.length-1)] = item;
    } else if (Array.isArray(index)) {
      index.forEach(function(index) {
        this.clipPut(index, item);
      }, this);
    }
    return this;
  }
});
