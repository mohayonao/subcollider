/**
 * Separates the array into sub-array by randomly separating elements according to the given probability.
 * @arguments _([probability=0.5])_
 */
sc.define("curdle", {
  Array: function(probability) {
    probability = probability === void 0 ? 0.5 : probability;
    return this.separate(function() {
      return probability.coin();
    });
  }
});
