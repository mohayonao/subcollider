(function(global) {
  "use strict";

  var slice = [].slice;
  var conflicts = {
    Number  : [],
    Boolean : [],
    Array   : ["indexOf","every","concat","reverse","pop"],
    String  : [],
    Function: []
  };

  var sc = function(that) {
    var key, args;
    if (typeof that === "string") {
      key  = that;
      args = slice.call(arguments, 1);
      return function(that) {
        return that[key].apply(that, args.concat(slice.call(arguments, 1)));
      };
    }
    return function() { return this; };
  };
  var make_sc_function = function(klass, func) {
    if (typeof klass === "string") {
      return function(that) {
        return that[klass].apply(that, slice.call(arguments, 1));
      };
    } else {
      return function() {
        var args = slice.call(arguments);
        if (args[0] instanceof klass) {
          return func.apply(args[0], args.slice(1));
        }
        return null;
      };
    }
  };
  sc.register = function(key, opts) {
    var klassname, klass, func;
    if (Array.isArray(key)) {
      return key.forEach(function(key) { sc.register(key, opts); });
    }
    sc[key] = make_sc_function(key);
    for (klassname in opts) {
      klass = global[klassname];
      func  = opts[klassname];
      if (typeof klass !== "function") { continue; }
      if (/^\*\w+$/.test(key)) {
        key = key.substr(1);
        if (!klass[key]) {
          klass[key] = func;
        } else {
          console.warn("conflict: " + klassname + "." + key);
        }
      } else {
        if (!klass.prototype[key]) {
          klass.prototype[key] = func;
        } else {
          if (conflicts[klassname].indexOf(key) === -1) {
            console.warn("conflict: " + klassname + "#" + key);
          }
        }
        if (!klass[key]) {
          klass[key] = make_sc_function(klass, func);
        }
      }
    }
  };
  sc.func = function(arg) {
    if (typeof arg === "function") {
      return arg;
    } else if (typeof arg === "string") {
      return sc(arg);
    }
    return function() { return arg; };
  };
  sc.use = function(type) {
    if (type === "global") {
      Object.keys(sc).forEach(function(key) { global[key] = sc[key]; });
    }
    return sc;
  };
  Number.prototype.sc = Array.prototype.sc = String.prototype.sc = Function.prototype.sc =
    function(key) {
      return this[key].bind.apply(this[key], [this].concat(slice.call(arguments, 1)));
    };

  var exports = sc;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = global.sc = exports;
  } else {
    sc.noConflict = (function() {
      var _sc = window.sc;
      return function() {
        if (window.sc === exports) {
          window.sc = _sc;
        }
        return exports;
      };
    })();
    window.sc = exports;
  }

})(this.self||global);
