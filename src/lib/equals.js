sc.define(["equals", "=="], function() {
  var equals = function(arg) {
    return this === arg;
  };
  return {
    Number : equals,
    Boolean: equals,
    Array: function(arg) {
      if (!Array.isArray(arg) || this.length !== arg.length) {
        return false;
      }
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (!this[i].equals(arg[i])) {
          return false;
        }
      }
      return true;
    },
    String  : equals,
    Function: equals
  };
});
