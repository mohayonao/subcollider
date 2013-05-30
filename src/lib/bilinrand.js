/**
 * Bilateral linearly distributed random number from *-this* to *+this*.
 * @arguments _none_
 */
sc.define("bilinrand", {
  Number: function() {
    return (Math.random() - Math.random()) * this;
  },
  Array: function() {
    return this.map(function(x) { return x.bilinrand(); });
  }
});
