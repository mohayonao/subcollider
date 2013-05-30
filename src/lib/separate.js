/**
 * Separates the collection into sub-collections by calling the function for each adjacent pair of elements. If the function returns true, then a separation is made between the elements.
 * @arguments _(function)_
 * @example
 *  sc.Range("0..10").separate("isPrime");
 *  // => [ [0,1,2] , [3], [4,5], [6,7], [8,9,10] ]
 */
sc.define("separate", {
  Array: function(func) {
    var list, sublist;
    func = func === void 0 ? sc.func(true) : sc.func(func);
    list = [];
    sublist = [];
    this.doAdjacentPairs(function(a, b, i) {
      sublist.push(a);
      if (func(a, b, i)) {
        list.push(sublist);
        sublist = [];
      }
    });
    if (this.length > 0) {
      sublist.push(this[this.length-1]);
    }
    list.push(sublist);
    return list;
  }
});
