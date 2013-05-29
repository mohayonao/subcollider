/**
 * Iterate over the elements in order, calling the function for each element. The function is passed two arguments, the element and an index.
 * @arguments _(function)_
 */
sc.define("do", {
  Number: function(func) {
    func = sc.func(func);
    var i, imax = this|0;
    for (i = 0; i < imax; ++i) {
      func(i, i);
    }
    return this;
  },
  Array: function(func) {
    this.forEach(sc.func(func));
    return this;
  }
});
