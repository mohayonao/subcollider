/**
 * Iterate over the elements in reverse order, calling the function for each element. The function is passed two arguments, the element and an index.
 * @arguments _(function)_
 */
sc.define("reverseDo", {
  Number: function(func) {
    func = sc.func(func);
    var i = this|0, j = 0;
    while (--i >= 0) {
      func(i, j++);
    }
    return this;
  }
});
