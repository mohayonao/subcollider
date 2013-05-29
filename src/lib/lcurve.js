/**
 * map the receiver onto an L-curve.
 * @arguments _([a=1, m=0, n=1, tau=1])_
 */
sc.define("lcurve", {
  Number: function(a, m, n, tau) {
    a = a === void 0 ? 1 : a;
    m = m === void 0 ? 0 : m;
    n = n === void 0 ? 1 : n;
    tau = tau === void 0 ? 1 : tau;
    var rTau, x = -this;
    if (tau === 1) {
      return a * (m * Math.exp(x) + 1) / (n * Math.exp(x) + 1);
    } else {
      rTau = 1 / tau;
      return a * (m * Math.exp(x) * rTau + 1) / (n * Math.exp(x) * rTau + 1);
    }
  },
  Array: function(a, m, n, tau) {
    return this.map(function(x) { return x.lcurve(a, m, n, tau); });
  }
});
