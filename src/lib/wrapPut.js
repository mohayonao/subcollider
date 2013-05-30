/**
 * Same as `put`, but values for index greater than the size of the Array will be wrapped around to 0.
 * @arguments _(index, item)_
 */
sc.define("wrapPut", {
  Array: function(index, item) {
    if (typeof index === "number") {
      this[index.iwrap(0, this.length-1)] = item;
    } else if (Array.isArray(index)) {
      index.forEach(function(index) {
        this.wrapPut(index, item);
      }, this);
    }
    return this;
  }
});
