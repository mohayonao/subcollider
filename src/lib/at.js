/**
 * Return the item at *index*.
 * @arguments _(index)_
 * @example
 *  x = [10,20,30];
 *  y = [0,0,2,2,1];
 *  x.at(y); // returns [ 10, 10, 30, 30, 20 ]
 */
sc.define(["at", "@"], {
  Array: function(index) {
    if (Array.isArray(index)) {
      return index.map(function(index) {
        return this.at(index);
      }, this);
    }
    return this[index|0];
  }
});
