(function(sc) {
  "use strict";

  sc.register("nearestInScale", {
    Number: function(scale, stepsPerOctave) {
      stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
      return scale.performNearestInScale(this, stepsPerOctave);
    },
    Array: function(scale, stepsPerOctave) {
      // collection is sorted
      stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
      var root = this.trunc(stepsPerOctave);
      var key  = this.opMod(stepsPerOctave);
      return key.nearestInScale(scale).opAdd(root);
    }
  });

})(sc);
