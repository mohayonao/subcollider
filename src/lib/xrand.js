/**
 * a random value from zero to this, excluding the value exclude.
 * @arguments _(exclude)_
 */
sc.define("xrand", {
  Number: function(exclude) {
    exclude = exclude === void 0 ? 0 : exclude;
    return (exclude + (this - 1).rand() + 1) % this;
  }
});
