(function(sc) {
  "use strict";

  sc.register("*fill2D", {
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

})(sc);
