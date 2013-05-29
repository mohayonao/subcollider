/**
 * Return a new Array of length maxlen with the items partly repeated (random choice of given probability).
 * @arguments _([probability=0.25, maxlen=100])_
 */
sc.define("sputter", {
  Array: function(probability, maxlen) {
    probability = probability === void 0 ? 0.25 : probability;
    maxlen      = maxlen      === void 0 ? 100  : maxlen|0;
    var a = [], i = 0, j = 0, size = this.length;
    while (i < size && j < maxlen) {
      a[j++] = this[i];
      if (probability < Math.random()) { i += 1; }
    }
    return a;
  }
});
