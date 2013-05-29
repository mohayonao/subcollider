/**
 * Put the *values* in the corresponding indices given by *keys*. If one of the two argument arrays is longer then it will wrap.
 * @arguments _(keys, values)_
 */
sc.define("putEach", {
  Array: function(keys, values) {
    keys = keys.asArray();
    values = values.asArray();
    keys.map(function(key, i) {
      this[key] = values.wrapAt(i);
    }, this);
    return this;
  }
});
