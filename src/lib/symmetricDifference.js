/**
 * Return the set of all items which are not elements of both this and *that*. this -- that
 * @arguments _(that)_
 * @example
 *  [1, 2, 3].symmetricDifference([2, 3, 4, 5]); // => [ 1, 4, 5 ]
 */
sc.define("symmetricDifference", {
  Array: function(that) {
    var result = [], i, imax;
    for (i = 0, imax = this.length; i < imax; ++i) {
      if (that.indexOf(this[i]) === -1) {
        result.push(this[i]);
      }
    }
    for (i = 0, imax = that.length; i < imax; ++i) {
      if (this.indexOf(that[i]) === -1) {
        result.push(that[i]);
      }
    }
    return result;
  }
});
