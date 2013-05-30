/**
 * Creates a 2 dimensional Array of the given sizes. The items are determined by evaluation of the supplied function. The function is passed row and column indexes as arguments.
 * @arguments _(rows, cols [, function=nil])_
 * @example
 *  Array.fill2D(3, 3, 1);
 *  // => [ [ 1, 1, 1 ],
 *  //      [ 1, 1, 1 ],
 *  //      [ 1, 1, 1 ] ]
 */
sc.define("*fill2D", {
  Array: function(rows, cols, func) {
    rows |= 0;
    cols |= 0;
    func = sc.func(func);
    var a, a2, row, col;
    a = new Array(rows);
    for (row = 0; row < rows; ++row) {
      a2 = a[row] = new Array(cols);
      for (col = 0; col < cols; ++col) {
        a2[col] = func(row, col);
      }
    }
    return a;
  }
});
