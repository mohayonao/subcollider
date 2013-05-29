/**
 * Remove and return the last element of the Array.
 * @arguments _none_
 * @example
 *  [1, 2, 3].pop(); // 3
 */
sc.define("pop", {
  Array: function() {
    return this.pop();
  }
});
