/**
 * Returns a linearly interpolated value between the two closest indices.
 * @arguments _(index [, method="clipAt"])_
 * @example
 *   [2, 5, 6].blendAt(0.4); // => 3.2
 */
sc.define("blendAt", {
  Array: function(index, method) {
    if (Array.isArray(index)) {
      return index.map(function(index) {
        return this.blendAt(index, method);
      }, this);
    }
    method = method === void 0 ? "clipAt" : method;
    var i = Math.floor(index);
    var x0 = this[method](i  );
    var x1 = this[method](i+1);
    return x0 + Math.abs(index - i) * (x1 - x0);
  }
});
