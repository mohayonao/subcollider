/**
 * Returns new a JSON string based upon *this*
 * @arguments _none_
 */
sc.define("asJSON", function() {
  var asJSON = function() {
    return JSON.stringify(this);
  };
  return {
    Number : asJSON,
    Boolean: asJSON,
    Array  : asJSON,
    String : asJSON
  };
});
