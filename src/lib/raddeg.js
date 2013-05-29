/**
 * converts radian to degree
 * @arguments _none_
 */
sc.define("raddeg", {
  Number: function() {
    return this * 180 / Math.PI;
  },
  Array: function() {
    return this.map(function(x) { return x.raddeg(); });
  }
});
