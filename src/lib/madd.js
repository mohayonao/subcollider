/**
 * this * mul + add
 * @arguments _(mul, add)_
 */
sc.define("madd", {
  Number: function(mul, add) {
    if (Array.isArray(mul) || Array.isArray(add)) {
      return [this,mul,add].flop().map(function(items) {
        return items[0].madd(items[1],items[2]);
      });
    }
    return this * mul + add;
  },
  Array: function(mul, add) {
    return this.map(function(x) { return x.madd(mul, add); });
  }
});
