(function(sc) {
  "use strict";

  sc.register("linexp", {
    Number: function(inMin, inMax, outMin, outMax, clip) {
      if (Array.isArray(inMin) || Array.isArray(inMax) ||
          Array.isArray(outMin) || Array.isArray(outMax)) {
        return [this,inMin,inMax,outMin,outMax].flop().map(function(items) {
          return items[0].linexp(items[1],items[2],items[3],items[4],clip);
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
      return Math.pow(outMax/outMin, (this-inMin)/(inMax-inMin)) * outMin;
    },
    Array: function(inMin, inMax, outMin, outMax, clip) {
      return this.map(function(x) { return x.linexp(inMin, inMax, outMin, outMax, clip); });
    }
  });

})(sc);
