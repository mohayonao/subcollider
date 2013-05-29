/**
 * Calls *function* for numbers from this up to endval stepping each time by a step specified by second.
 * @arguments _(second, last, function)_
 */
sc.define("forSeries", {
  Number: function(second, last, func) {
    return this.forBy(last, second - this, func);
  }
});
