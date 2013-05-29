/**
 * Executes *function* for all integers from this to *endval*, inclusive.
 * @arguments _(endval, function)_
 */
sc.define("for", {
  Number: function(endValue, func) {
    func = sc.func(func);
    var i = this, j = 0;
    while (i <= endValue) { func(i++, j++); }
    return this;
  }
});
