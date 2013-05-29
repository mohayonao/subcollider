sc.define("product", {
  Array: function(func) {
    var product = 1, i, imax;
    if (func) {
      func = sc.func(func);
      for (i = 0, imax = this.length; i < imax; ++i) {
        product = product.opMul(func(this[i], i));
      }
    } else {
      // optimized version if no function
      for (i = 0, imax = this.length; i < imax; ++i) {
        product = product.opMul(this[i]);
      }
    }
    return product;
  }
});
