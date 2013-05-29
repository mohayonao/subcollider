/**
 * Distortion with a perfectly linear region from -0.5 to +0.5
 * @arguments _none_
 */
sc.define("softclip", {
  Number: function() {
    var absx = Math.abs(this);
    return absx <= 0.5 ? this : (absx - 0.25) / this;
  },
  Array: function() {
    return this.map(function(x) { return x.softclip(); });
  }
});
