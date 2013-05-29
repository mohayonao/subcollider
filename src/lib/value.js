sc.define("value", {
  Number: function() {
    return this;
  },
  Boolean: function() {
    return this;
  },
  Array: function() {
    return this;
  },
  String: function() {
    return this;
  },
  Function: function() {
    return this.apply(this, arguments);
  }
});
