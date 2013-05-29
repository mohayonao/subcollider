sc.define("instill", {
  Array: function(index, item, defaultValue) {
    var res;
    index = Math.max(0, index|0);
    if (index >= this.length) {
      res = this.extend(index + 1, defaultValue);
    } else {
      res = this.slice();
    }
    res[index] = item;
    return res;
  }
});
