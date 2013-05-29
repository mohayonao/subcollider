sc.define("performNearestInScale", {
  Array: function(degree, stepsPerOctave) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    var root = degree.trunc(stepsPerOctave);
    var key  = degree % stepsPerOctave;
    return this.performNearestInList(key) + root;
  }
});
