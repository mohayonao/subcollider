(function(sc) {
  "use strict";

  sc.register(["foldAt", "@|@"], {
    Array: function(index) {
      if (Array.isArray(index)) {
        return index.map(function(index) {
          return this.foldAt(index);
        }, this);
      }
      return this[(index|0).fold(0, this.length-1)];
    }
  });

})(sc);
