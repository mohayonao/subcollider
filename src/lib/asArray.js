/**
 * Returns a new Array base upon *this*
 * @arguments _none_
 * @example
 *  (1).asArray(); // => [ 1 ]
 *  [1, 2, 3].asArray(); // => [ 1, 2, 3 ]
 */
sc.define("asArray", function() {
  var asArray = function() {
    return [this];
  };
  return {
    Number : asArray,
    Boolean: asArray,
    Array: function() {
      return this.slice();
    },
    String  : asArray,
    Function: asArray
  };
});
