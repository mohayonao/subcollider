sc.define("bubble", {
  Array: function(depth, levels) {
    depth  = depth  === void 0 ? 0 : depth;
    levels = levels === void 0 ? 1 : levels;
    if (depth <= 0) {
      if (levels <= 1) { return [this]; }
      return [this.bubble(depth, levels-1)];
    }
    return this.map(function(item) {
      return item.bubble(depth-1, levels);
    });
  },
  Number: function(depth, levels) {
    depth  = depth  === void 0 ? 0 : depth;
    levels = levels === void 0 ? 1 : levels;
    if (levels <= 1) { return [this]; }
    return [this.bubble(depth, levels-1)];
  }
});
