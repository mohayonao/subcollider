/**
 * Convert MIDI note to cycles per second
 * @returns cycles per second
 * @example
 *  (69).midicps(); // => 440
 *  Array.range("69..81").midicps(); // => [ 440, 466.1637, ... , 830.6093, 880 ]
 */
sc.define("midicps", {
  Number: function() {
    return 440 * Math.pow(2, (this - 69) * 1/12);
  },
  Array: function() {
    return this.map(function(x) { return x.midicps(); });
  },
  Function: function() {
    var func = this;
    return function() {
      return func.apply(func, arguments).midicps();
    };
  }
});
