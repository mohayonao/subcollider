/**
 * map the receiver from an assumed curve-exponential input range (inMin..inMax) to a linear output range (outMin..outMax). If the input exceeds the assumed input range.
 * @arguments _([inMin=0, inMax=1, outMin=0, outMax=1, curve=-4, clip="minmax"])_
 * @example
 *   [0, 2, 4, 6, 8, 10].curvelin(0, 10, -1, 1);
 *   // => [ -1, 0.2222, 0.2905, 0.3846, 0.5375, 1 ]
 */
sc.define("curvelin", {
  Number: function(inMin, inMax, outMin, outMax, curve, clip) {
    if (sc.isArrayArgs(arguments, 4)) {
      return [this,inMin,inMax,outMin,outMax].flop().map(function(items) {
        return items[0].curvelin(items[1],items[2],items[3],items[4],curve,clip);
      });
    }
    inMin  = inMin  === void 0 ?  0 : inMin;
    inMax  = inMax  === void 0 ?  1 : inMax;
    outMin = outMin === void 0 ?  0 : outMin;
    outMax = outMax === void 0 ?  1 : outMax;
    curve  = curve  === void 0 ? -4 : curve;
    switch (clip) {
    case "min":
      if (this <= inMin) { return outMin; }
      break;
    case "max":
      if (this >= inMax) { return outMax; }
      break;
    case "minmax":
      /* falls through */
    default:
      if (this <= inMin) { return outMin; }
      if (this >= inMax) { return outMax; }
      break;
    }
    if (Math.abs(curve) < 0.001) {
      return this.linlin(inMin, inMax, outMin, outMax);
    }
    var grow = Math.exp(curve);
    var a = (outMax - outMin) / (1.0 - grow);
    var b = outMin + a;
    var scaled = (this - inMin) / (inMax - inMin);
    return Math.log((b - scaled) / a) / curve;
  },
  Array: function(inMin, inMax, outMin, outMax, curve, clip) {
    return this.map(function(x) { return x.curvelin(inMin, inMax, outMin, outMax, curve, clip); });
  }
});
