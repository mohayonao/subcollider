(function(sc) {
  "use strict";

  /**
   * Convert cycles per second to MIDI note.
   * @returns midi note
   * @example
   *  (440).cpsmidi(); // => 69
   *  Array.range(440, 880, 110).cpsmidi(); // => [69, 72.8631, 76.0195, 78.6882]
   */
  sc.register("cpsmidi", {
    Number: function() {
      return Math.log(Math.abs(this) * 1/440) * Math.LOG2E * 12 + 69;
    },
    Array: function() {
      return this.map(function(x) { return x.cpsmidi(); });
    },
    Function: function() {
      var func = this;
      return function() {
        return func.apply(func, arguments).cpsmidi();
      };
    }
  });

})(sc);
