sc.define("addIfNotNil", {
  Array: function(item) {
    if (item !== null) {
      return this.concat([item]);
    }
    return this;
  }
});
