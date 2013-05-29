/**
 * number of required bits
 * @arguments _none_
 */
sc.define("numBits", {
  Number: function() {
    if (this <= 0) {
      return Math.floor(Math.log(0x100000000 + (this|0)) / Math.log(2)) + 1;
    } else if (this > 0) {
      return Math.floor(Math.log(this|0) / Math.log(2)) + 1;
    }
  },
  Array: function() {
    return this.map(function(x) { return x.numBits(); });
  }
});
