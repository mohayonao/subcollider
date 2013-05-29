/**
 * a gaussian distributed random number.
 * @arguments _(upperLimit)_
 */
sc.define("gauss", {
  Number: function(standardDeviation) {
    return (((Math.sqrt(-2*Math.log(Math.random())) * Math.sin(Math.random() * 2 * Math.PI)) * standardDeviation) + this);
  },
  Array: function(standardDeviation) {
    return this.map(function(x) { return x.gauss(standardDeviation); });
  }
});
