/**
 * Answer the number of items in the receiver which are equal to anObject.
 * @arguments _(item)_
 * @example
 *  [1, 2, 3, 3, 4, 3, 4, 3].occurrencesOf(3); // => 4
 */
sc.define("occurrencesOf", {
  Array: function(item) {
    var sum = 0;
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (this[i] === item || this[i].equals(item)) { ++sum; }
    }
    return sum;
  }
});
