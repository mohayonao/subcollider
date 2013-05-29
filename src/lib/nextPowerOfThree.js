/**
 * the next power of three
 * @arguments _none_
 */
sc.define("nextPowerOfThree", {
  Number: function() {
    return Math.pow(3, Math.ceil(Math.log(this) / Math.log(3)));
  },
  Array: function() {
    return this.map(function(x) { return x.nextPowerOfThree(); });
  }
});
