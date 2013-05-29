/**
 * Choose an element from the collection at random using a list of probabilities or weights. The weights must sum to 1.0.
 * @arguments _(weights)_
 * @example
 *  [1, 2, 3, 4].wchoose([0.1, 0.2, 0.3, 0.4]);
 */
sc.define("wchoose", {
  Array: function(weights) {
    var sum = 0;
    for (var i = 0, imax = weights.length; i < imax; ++i) {
      sum += weights[i];
      if (sum >= Math.random()) {
        return this[i];
      }
    }
    return this[weights.length - 1];
  }
});
