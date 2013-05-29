sc.define("removing", {
  Array: function(item) {
    var a = this.slice();
    a.remove(item);
    return a;
  }
});
