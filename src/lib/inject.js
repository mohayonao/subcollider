/**
 * reduce
 * @arguments _(thisValue, function)_
 * @example
 *   [1, 2, 3, 4, 5].inject(0, "+"); // => 15
 */
sc.define("inject", {
  Array: function(thisValue, func) {
    return this.reduce(sc.func(func), thisValue);
  }
});
