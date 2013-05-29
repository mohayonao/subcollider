/**
 * a random value from this.neg to this, excluding the value exclude.
 * @arguments _(exclude)_
 */
sc.define("xrand2", {
  Number: function(exclude) {
    exclude = exclude === void 0 ? 0 : exclude;
    var res = (2 * this).rand() - this;
    return (res === exclude) ? this : res;
  }
});
