/**
 * Creates a 3 dimensional Array of the given sizes. The items are determined by evaluation of the supplied function. The function is passed plane, row and column indexes as arguments.
 * @arguments _(planes, rows, cols [, function=nil])_
 * @example
 *  Array.fill3D(3, 3, 3, 1);
 *  // => [ [ [ 1, 1, 1 ],[ 1, 1, 1 ],[ 1, 1, 1 ] ],
 *  //      [ [ 1, 1, 1 ],[ 1, 1, 1 ],[ 1, 1, 1 ] ],
 *  //      [ [ 1, 1, 1 ],[ 1, 1, 1 ],[ 1, 1, 1 ] ] ]
 */
sc.define("*fill3D", {
  Array: function(planes, rows, cols, func) {
    planes |= 0;
    rows |= 0;
    cols |= 0;
    func = sc.func(func);
    var a, a2, a3, plane, row, col;
    a = new Array(planes);
    for (plane = 0; plane < planes; ++plane) {
      a2 = a[plane] = new Array(rows);
      for (row = 0; row < rows; ++row) {
        a3 = a2[row] = new Array(cols);
        for (col = 0; col < cols; ++col) {
          a3[col] = func(plane, row, col);
        }
      }
    }
    return a;
  }
});
