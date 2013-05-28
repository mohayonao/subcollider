(function(sc) {
  "use strict";

  /**
   * Creates an array of numbers progressing from *start* up to but not including *end*.
   * @arguments _([start=0], end [, step=1])_
   * @example
   *  Array.range(10); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
   *  Array.range(0, 30, 5); // [0, 5, 10, 15, 20, 25]
   */
  sc.register("*range", {
    Array: function(start, end, step) {
      start = +start || 0;
      step  = +step  || 1;
      if (end === void 0) {
        end   = start;
        start = 0;
      }
      var length = Math.max(0, Math.ceil((end - start) / step));
      var index  = -1;
      var result = new Array(length);
      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }
  });

  /**
   * @arguments _(end, step:1)_
   * @example
   *  (10).range(); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
   *  (10).range(30, 5); // [0, 5, 10, 15, 20, 25]
   */
  sc.register("range", {
    Number: function(end, step) {
      if (end === void 0) {
        return Array.series(this, 0, 1);
      }
      step = step === void 0 ? (this < end) ? +1 : -1 : step;
      return Array.range(this, end, step);
    }
  });

})(sc);
