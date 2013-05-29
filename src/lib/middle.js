sc.define("middle", {
  Array: function() {
    return this[(this.length - 1) >> 1];
  }
});
