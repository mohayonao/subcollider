/**
 * map the receiver from an assumed linear input range to a linear output range.
 * @arguments _([inMin=0, inMax=1, outMin=0, outMax=1, clip="minmax"])_
 */
sc.define("linlin", {
  Number: function(inMin, inMax, outMin, outMax, clip) {
    if (Array.isArray(inMin) || Array.isArray(inMax) ||
        Array.isArray(outMin) || Array.isArray(outMax)) {
      return [this,inMin,inMax,outMin,outMax].flop().map(function(items) {
        return items[0].linlin(items[1],items[2],items[3],items[4],clip);
      });
    }
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
    return (this-inMin)/(inMax-inMin) * (outMax-outMin) + outMin;
  },
  Array: function(inMin, inMax, outMin, outMax, clip) {
    return this.map(function(x) { return x.linlin(inMin, inMax, outMin, outMax, clip); });
  }
});
