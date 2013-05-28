(function(sc) {
  "use strict";

  /**
   * Return the last element of the collection.
   * @arguments _none_
   * @example
   *  [3, 4, 5].last(); // => 5
   */
  sc.register("last", {
    Array: function() {
      return this[this.length-1];
    }
  });

})(sc);
