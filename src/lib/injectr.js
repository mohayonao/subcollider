/**
 * reduce right
 * @arguments _(thisValue, function)_
 * @example
 *   [1, 2, 3, 4, 5].injectr([], "++"); // => [ 5, 4, 3, 2, 1 ]
 */
sc.define("injectr", {
  Array: function(thisValue, func) {
    return this.reduceRight(sc.func(func), thisValue);
  }
});
