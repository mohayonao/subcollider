/**
 * Choose an element from the collection at random.
 * @arguments _none_
 * @example
 *  [1, 2, 3, 4].choose();
 */
sc.define("choose", {
  Array: function() {
    return this[(Math.random() * this.length)|0];
  }
});
