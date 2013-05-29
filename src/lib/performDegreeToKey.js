sc.define("performDegreeToKey", {
  Array: function(scaleDegree, stepsPerOctave, accidental) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    accidental     = accidental     === void 0 ?  0 : accidental;
    var baseKey = (stepsPerOctave * ((scaleDegree / this.length)|0)) + this.wrapAt(scaleDegree);
    return accidental === 0 ? baseKey : baseKey + (accidental * (stepsPerOctave / 12));
  }
});
