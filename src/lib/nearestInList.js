(function(sc) {
  "use strict";

  sc.register("nearestInList", {
    Number: function(list) {
      return list.performNearestInList(this);
    },
    Array: function(list) {
      // collection is sorted
      return this.map(function(item) {
        return list.at(list.indexIn(item));
      });
    }
  });

})(sc);
