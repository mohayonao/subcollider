sc.define("performNearestInList", {
  Array: function(degree) {
    return this[this.indexIn(degree)];
  }
});
