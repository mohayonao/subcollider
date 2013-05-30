/**
 * Same as `swap`, but the sequences fold back on the list elements.
 * @arguments _(i, j)_
 */
sc.define("foldSwap", {
  Array: function(i, j) {
    i = (i|0).fold(0, this.length-1);
    j = (j|0).fold(0, this.length-1);
    var t = this[i];
    this[i] = this[j];
    this[j] = t;
    return this;
  }
});
