/**
 * converts degree to radian
 * @arguments _none_
 */
sc.define("degrad", {
  Number: function() {
    return this * Math.PI / 180;
  },
  Array: function() {
    return this.map(function(x) { return x.degrad(); });
  }
});
