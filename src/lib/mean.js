sc.define("mean", {
  Array: function(func) {
    if (func) { func = sc.func(func); }
    return this.sum(func) / this.length;
  }
});
