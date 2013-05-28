(function(sc) {
  "use strict";

  /**
   * Return the first element of the collection.
   * @arguments _none_
   * @example
   *  [3, 4, 5].first() # => 3
   */
  sc.register("first", {
    Array: function() {
      return this[0];
    }
  });

})(sc);
