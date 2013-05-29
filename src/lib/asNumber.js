/**
 * Returns new a Number based upon *this*
 * @arguments _none_
 * @example
 *  (true).asNumber(); // => 1
 *  ["a", 10, 3.14].asNumber(); => 10
 */
sc.define("asNumber", {
  Number: function() {
    return this;
  },
  Boolean: function() {
    return this ? 1 : 0;
  },
  Array: function() {
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (typeof this[i] === "number") { return this[i]; }
    }
    return 0;
  },
  String: function() {
    return isNaN(+this) ? 0 : +this;
  },
  Function: function() {
    return 0;
  }
});
