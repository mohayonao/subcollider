(function(sc) {
  "use strict";

  sc.register("keyToDegree", {
    Number: function(scale, stepsPerOctave) {
      stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
      return scale.performKeyToDegree(this, stepsPerOctave);
    },
    Array: function(scale, stepsPerOctave) {
      stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
      return this.map(function(val) {
        return val.keyToDegree(scale, stepsPerOctave);
      });
    }
  });

})(sc);
