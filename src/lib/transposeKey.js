sc.define("transposeKey", {
  Array: function(amout, octave) {
    octave = octave === void 0 ? 12 : octave;
    return this.opAdd(amout).opMod(octave).sort();
  }
});
