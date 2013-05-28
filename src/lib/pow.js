(function(sc) {
  "use strict";

  /**
   * this to the power of aNumber
   * @arguments _(num)_
   */
  sc.register(["pow", "**"], {
    Number: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.pow(num); }, this);
      }
      return Math.pow(this ,num);
    },
    Array: function(num) {
      if (Array.isArray(num)) {
        return this.map(function(x, i) { return x.pow(num.wrapAt(i)); });
      } else {
        return this.map(function(x) { return x.pow(num); });
      }
    }
  });

})(sc);
