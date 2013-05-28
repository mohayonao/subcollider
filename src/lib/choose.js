(function(sc) {
  "use strict";

  /**
   * Choose an element from the collection at random.
   * @example
   *  [1, 2, 3, 4].choose();
   */
  sc.register("choose", {
    Array: function() {
      return this[(Math.random() * this.length)|0];
    }
  });

})(sc);
