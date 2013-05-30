/**
 * Returns a new Function based upon *this*
 * @arguments _none_
 * @example
 *  (1).asFunction()(); // => 1
 */
sc.define("asFunction", function() {
  var asFunction = function() {
    var that = this;
    return function() { return that; };
  };
  return {
    Number: asFunction,
    Array : asFunction,
    String: asFunction,
    Function: function() {
      return this;
    }
  };
});
