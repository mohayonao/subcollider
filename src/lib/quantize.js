(function(sc) {
  "use strict";

  sc.register("quantize", {
    Number: function(quantum, tolerance, strength) {
      if (Array.isArray(quantum) || Array.isArray(tolerance) || Array.isArray(strength)) {
        return [this,quantum,tolerance,strength].flop().map(function(items) {
          return items[0].quantize(items[1],items[2],items[3]);
        });
      }
      quantum = typeof quantum === "undefined" ? 1 : quantum;
      tolerance = typeof tolerance === "undefined" ? 0.05 : tolerance;
      strength = typeof strength === "undefined" ? 1 : strength;
      var round = this.round(quantum);
      var diff = round - this;
      if (Math.abs(diff) < tolerance) {
        return this + (strength * diff);
      }
      return this;
    },
    Array: function(quantum, tolerance, strength) {
      return this.map(function(x) { return x.quantize(quantum, tolerance, strength); });
    }
  });

})(sc);
