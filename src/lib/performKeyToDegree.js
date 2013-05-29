sc.define("performKeyToDegree", {
  Array: function(degree, stepsPerOctave) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    var n = ((degree / stepsPerOctave)|0) * this.length;
    var key = degree % stepsPerOctave;
    return this.indexInBetween(key) + n;
  }
});
