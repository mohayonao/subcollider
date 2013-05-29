sc.define("postln", {
  Number: function() {
    console.log(this);
    return this;
  },
  Boolean: function() {
    console.log(this);
    return this;
  },
  Array: function() {
    console.log(JSON.stringify(this));
    return this;
  },
  String: function() {
    console.log(this);
    return this;
  },
  Function: function() {
    console.log(this);
    return this;
  }
});
