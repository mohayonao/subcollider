/**
 * Returns a new Boolean based upon *this*
 * @arguments _none_
 * @example
 *  (0).asBoolean(); // false
 *  (1).asBoolean(); // true
 *  [ ].asBoolean(); // false
 *  [0].asBoolean(); // true
 */
sc.define("asBoolean", {
  Number: function() {
    return (this) !== 0;
  },
  Boolean: function() {
    return this;
  },
  Array: function() {
    return this.length > 0;
  },
  String: function() {
    return this === "true";
  },
  Function: function() {
    return true;
  }
});
