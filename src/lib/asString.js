/**
 * Returns a new String based upon *this*
 */
sc.define("asString", function() {
  var asString = function() {
    return this.toString();
  };
  return {
    Number  : asString,
    Boolean : asString,
    Array   : asString,
    String  : asString,
    Function: asString
  };
});
