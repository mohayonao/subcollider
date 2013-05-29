/**
 * Executes *function* for all integers from this to *endval*, inclusive, stepping each time by *stepval*.
 * @arguments _(endval, stepval, function)_
 */
sc.define("forBy", {
  Number: function(endValue, stepValue, func) {
    var i = this, j = 0;
    if (stepValue > 0) {
      while (i <= endValue) { func(i, j++); i += stepValue; }
    } else {
      while (i >= endValue) { func(i, j++); i += stepValue; }
    }
    return this;
  }
});
