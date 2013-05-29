/**
 * the factorial of this.
 * @arguments _none_
 */
sc.define("factorial", {
  Number: function() {
    if (this < 0) {
      return 1;
    } else {
      return [1,1,2,6,24,120,720,5040,40320,362880,3628800,39916800,479001600][this|0];
    }
  },
  Array: function() {
    return this.map(function(x) { return x.factorial(); });
  }
});
