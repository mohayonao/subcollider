sc.define("atInc", {
  Array: function(index, inc) {
    inc = inc === void 0 ? 1 : inc;
    return this.put(index, this.at(index).opAdd(inc));
  }
});
