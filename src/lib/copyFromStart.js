/**
 * Return a new Array which is a copy of the indexed slots of the receiver from the start of the collection to *end*.
 * @arguments _(end)_
 */
sc.define("copyFromStart", function() {
  var copyFromStart = function(end) {
    if (Array.isArray(end)) {
      return end.map(function(end) {
        return this.copyFromStart(end);
      }, this);
    }
    end = Math.max(0, end|0);
    return this.slice(0, end + 1);
  };
  return {
    Array : copyFromStart,
    String: copyFromStart
  };
});
