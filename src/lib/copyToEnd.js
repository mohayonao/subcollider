/**
 * Return a new Array which is a copy of the indexed slots of the receiver from *start* to the end of the collection
 */
sc.define("copyToEnd", function() {
  var copyToEnd = function(start) {
    if (Array.isArray(start)) {
      return start.map(function(start) {
        return this.copyToEnd(start);
      }, this);
    }
    start = Math.max(0, start|0);
    return this.slice(start);
  };
  return {
    Array : copyToEnd,
    String: copyToEnd
  };
});
