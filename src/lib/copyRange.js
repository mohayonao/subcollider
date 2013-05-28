(function(sc) {
  "use strict";

  /**
   * Return a new Array which is a copy of the indexed slots of the receiver from *start* to *end*.
   * @arguments _(start, end)_
   * @example
   *  [1, 2, 3, 4, 5].copyRange(1, 3); // [ 2, 3, 4 ]
   */
  var copyRange = function(start, end) {
    if (Array.isArray(start) || Array.isArray(end)) {
      return [start, end].flop().map(function(items) {
        return this.copyRange(items[0], items[1]);
      }, this);
    }
    start = Math.max(0, start|0);
    end   = Math.max(0, end|0);
    return this.slice(start, end + 1);
  };

  sc.register("copyRange", {
    Array : copyRange,
    String: copyRange
  });

})(sc);
