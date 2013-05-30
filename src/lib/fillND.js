/**
 * Creates a N dimensional Array where N is the size of the array *dimensions*. The items are determined by evaluation of the supplied function. The function is passed N number of indexes as arguments.
 * @arguments _(dimensions [, function=nil])_
 * @example
 *   Array.fillND([1, 2, 3, 4], function(a, b, c, d) { return a+b+c+d; }); // => 4D
 */
sc.define("*fillND", function() {
  var fillND = function(dimensions, func, args) {
    var n, a, argIndex, i;
    n = dimensions[0];
    a = [];
    argIndex = args.length;
    args = args.concat(0);
    if (dimensions.length <= 1) {
      for (i = 0; i < n; ++i) {
        args[argIndex] = i;
        a.push(func.apply(null, args));
      }
    } else {
      dimensions = dimensions.slice(1);
      for (i = 0; i < n; ++i) {
        args[argIndex] = i;
        a.push(fillND(dimensions, func, args));
      }
    }
    return a;
  };
  return {
    Array: function(dimensions, func) {
      return fillND(dimensions, sc.func(func), []);
    }
  };
});
