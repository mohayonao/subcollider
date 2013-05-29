sc.define("invert", {
  Array: function(axis) {
    var index;
    if (this.length === 0) { return []; }
    if (typeof axis === "number") {
      index = axis * 2;
    } else {
      index = this.minItem() + this.maxItem();
    }
    return index.opSub(this);
  }
});
