sc.define("atModify", {
  Array: function(index, func) {
    return this.put(index, sc.func(func)(this.at(index), index));
  }
});
