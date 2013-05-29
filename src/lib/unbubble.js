sc.define("unbubble", {
  Array: function(depth, levels) {
    depth  = depth  === void 0 ? 0 : depth;
    levels = levels === void 0 ? 1 : levels;
    if (depth <= 0) {
      // converts a size 1 array to the item.
      if (this.length > 1) { return this; }
      if (levels <= 1) { return this[0]; }
      return this.unbubble(depth, levels-1);
    }
    return this.map(function(item) {
      return item.unbubble(depth-1);
    });
  }
});
