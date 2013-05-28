(function(sc) {
  "use strict";

  sc.register("mode", {
    Array: function(degree, octave) {
      octave = octave === void 0 ? 12 : octave;
      return this.rotate(degree.neg()).opSub(this.wrapAt(degree)).opMod(octave);
    }
  });

})(sc);
