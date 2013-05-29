sc.define("histo", {
  Array: function(steps, min, max) {
    var freqs, freqIndex, lastIndex, stepSize, outliers = 0;
    var i, imax;
    steps = steps === void 0 ? 100 : steps;
    min   = min   === void 0 ? this.minItem() : min;
    max   = max   === void 0 ? this.maxItem() : max;
    freqs = Array.fill(steps, 0);
    lastIndex = steps - 1;
    stepSize = (steps / (max - min))|0;
    for (i = 0, imax = this.length; i < imax; ++i) {
      freqIndex = ((this[i] - min) * stepSize)|0;
      if (freqIndex.inclusivelyBetween(0, lastIndex)) {
        freqs[freqIndex] = freqs[freqIndex] + 1;
      } else {
        // if max is derived from maxItem, count it in:
        if (this[i] === max) {
          freqs[steps-1] += 1;
        } else {
          outliers += 1;
        }
      }
      if (outliers > 0) {
        console.log("histogram :" + outliers + "out of (histogram) range values in collection.");
      }
    }
    return freqs;
  }
});
