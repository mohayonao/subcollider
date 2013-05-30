/**
 * Same as `swap`, but values for index greater than the size of the Array will be wrapped around to 0.
 * @arguments _(i, j)_
 */
sc.define("wrapSwap", {
  Array: function(i, j) {
    i = (i|0).iwrap(0, this.length-1);
    j = (j|0).iwrap(0, this.length-1);
    var t = this[i];
    this[i] = this[j];
    this[j] = t;
    return this;
  }
});
