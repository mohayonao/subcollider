/**
 * round the receiver to the quantum.
 * @arguments _([quantum=1, tolerance=0.05, strength=1])_
 * @example
 *  sc.Range("0,0.1..1").quantize(1, 0.3, 0.5)
 *  // => [ 0, 0.05, 0.1, 0.3, 0.4, 0.5, 0.6, 0.7, 0.9, 0.95, 1 ]
 */
sc.define("quantize", {
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
