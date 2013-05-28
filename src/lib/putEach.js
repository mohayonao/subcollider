(function(sc) {
  "use strict";

  sc.register("putEach", {
    Array: function(keys, values) {
      keys = keys.asArray();
      values = values.asArray();
      keys.map(function(key, i) {
        this[key] = values.wrapAt(i);
      }, this);
      return this;
    }
  });

})(sc);
