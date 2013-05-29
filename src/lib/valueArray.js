sc.define("valueArray", function() {
  var slice = [].slice;
  return {
    Number: function() {
      return this;
    },
    Boolean: function() {
      return this;
    },
    Array: function() {
      return this;
    },
    String: function() {
      return this;
    },
    Function: function() {
      if (arguments.length === 0) {
        return this.call(this);
      } else if (arguments.length === 1) {
        if (Array.isArray(arguments[0])) {
          return this.apply(this, arguments[0]);
        } else {
          return this.call(this, arguments[0]);
        }
      } else {
        return slice.call(arguments).flop().map(function(items) {
          return this.valueArray(items);
        }, this);
      }
    }
  };
});
