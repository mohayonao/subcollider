sc.define("obtain", {
  Array: function(index, defaultValue) {
    if (Array.isArray(index)) {
      return index.map(function(index) {
        return this.obtain(index, defaultValue);
      }, this);
    }
    index = Math.max(0, index|0);
    if (index < this.length) {
      return this[index|0];
    }
    return defaultValue;
  }
});
