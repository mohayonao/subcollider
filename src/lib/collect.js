/**
 * Answer a new array which consists of the results of function evaluated for each item in the collection. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 * @example
 *  [ 1, 2, 3, 4 ].collect("reciprocal"); // => [ 1, 0.5, 0.3333, 0.25 ]
 *  (3).collect(function(x) { return x * 100; }); // => [ 0, 100, 200 ]
 */
sc.define("collect", {
  Number: function(func) {
    func = sc.func(func);
    var a = new Array(this|0);
    for (var i = 0, imax = a.length; i < imax; ++i) {
      a[i] = func(i, i);
    }
    return a;
  },
  Array: function(func) {
    return this.map(sc.func(func));
  }
});
