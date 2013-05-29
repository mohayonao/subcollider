/**
 * Returns a new *Array* with the receiver items normalized between *min* and *max*.
 * @arguments _([min=0, max=1])_
 * @example
 *  [1, 2, 3].normalize(-20, 10); // => [ -20, -5, 10 ]
 */
sc.define("normalize", {
  Array: function(min, max) {
    min = min === void 0 ? 0 : min;
    max = max === void 0 ? 1 : max;
    var minItem = this.minItem();
    var maxItem = this.maxItem();
    return this.map(function(el) {
      return el.linlin(minItem, maxItem, min, max);
    });
  }
});
