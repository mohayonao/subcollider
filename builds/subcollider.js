(function(global) {
  "use strict";

(function(global) {
  "use strict";

  var VERSION = "0.1.1";

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
  sc.version = function() {
    return VERSION;
  };
  sc.version.major = function() {
    return +VERSION.split(".")[0];
  };
  sc.version.minor = function() {
    return +VERSION.split(".")[1];
  };
  sc.version.revision = function() {
    return +VERSION.split(".")[2];
  };
  sc.define = function(name, deps, payload) {
    if (arguments.length === 2) {
      payload = deps;
      deps    = null;
    }
    if (typeof payload === "function") {
      payload = payload(sc);
    }
    register(name, payload);
  };

  var register = function(key, opts) {
    var klassname, klass, func;
    if (Array.isArray(key)) {
      return key.forEach(function(key) { register(key, opts); });
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

  /**
   * @name use
   * @arguments _(type)_
   * @example
   *  sc.use("global"); // install sc.functions to global namespace
   *  midicps(69); // => 40
   */
  sc.use = function(type) {
    if (type === "global") {
      Object.keys(sc).forEach(function(key) {
        if (!global[key]) {
          global[key] = sc[key];
        }
      });
    }
    return sc;
  };
  Number.prototype.sc = Array.prototype.sc = String.prototype.sc = Function.prototype.sc =
    function(key) {
      return this[key].bind.apply(this[key], [this].concat(slice.call(arguments, 1)));
    };
  sc.isArrayArgs = function(list, len) {
    for (var i = 0, imax = Math.max(list.length, len|0); i < imax; ++i) {
      if (Array.isArray(list[i])) { return true; }
    }
    return false;
  };

  /**
   * @name Range
   * @description
   * Creates an array of numbers (positive and/or negative) progressing from *first* up to *last*.
   * @arguments _("[first[,second]]...?last")_
   * @aliases R
   * @example
   *  sc.Range(5); // => [ 0, 1, 2, 3, 4, 5 ]
   *  sc.Range("1..5"); // => [ 1, 2, 3, 4, 5 ]
   *  sc.Range("5..1"); // => [ 5, 4, 3, 2, 1 ]
   *  sc.Range("0, 2.5..10"); // => [ 0, 2.5, 5, 7.5, 10 ]
   *  sc.Range("0...10") // => [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
   */
  sc.Range = sc.R = (function() {
    var re = /^\s*(?:([-+]?(?:\d+|\d+\.\d+))\s*,\s*)?([-+]?(?:\d+|\d+\.\d+))(?:\s*\.\.(\.?)\s*([-+]?(?:\d+|\d+\.\d+)))?\s*$/;
    return function() {
      var a = [], m, i, x, first, last, step;
      if (typeof arguments[0] === "string") {
        if ((m = re.exec(arguments[0])) !== null) {
          if (m[4] === void 0) {
            first = 0;
            last  = +m[2];
            step  = (0 < last) ? +1 : -1;
          } else if (m[1] === void 0) {
            first = +m[2];
            last  = +m[4];
            step  = (first < last) ? +1 : -1;
          } else {
            first = +m[1];
            last  = +m[4];
            step  = +m[2] - first;
          }
          i = 0;
          x = first;
          if (m[3]) {
            if (step > 0) {
              while (x < last) { a[i++] = x; x += step; }
            } else {
              while (x > last) { a[i++] = x; x += step; }
            }
          } else {
            if (step > 0) {
              while (x <= last) { a[i++] = x; x += step; }
            } else {
              while (x >= last) { a[i++] = x; x += step; }
            }
          }
        }
      } else if (typeof arguments[0] === "number") {
        first = 0;
        last  = arguments[0];
        step  = (first < last) ? +1 : -1;
        i = 0;
        x = first;
        while (x <= last) {
          a[i++] = x;
          x += step;
        }
      }
      return a;
    };
  })();

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

})(global);

/**
 * absolute value
 * @arguments _none_
 * @example
 *  (-10).abs(); // => 10
 *  [ -2, -1, 0, 1, 2 ].abs(); // => [ 2, 1, 0, 1, 2 ]
 */
sc.define("abs", {
  Number: function() {
    return Math.abs(this);
  },
  Array: function() {
    return this.map(function(x) { return x.abs(); });
  }
});

/**
 * (a - b).abs()
 * @arguments _(number)_
 * @example
 *  sc.absdif(10, 15); // => 5
 */
sc.define("absdif", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.absdif(num); }, this);
    }
    return Math.abs(this - num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.absdif(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.absdif(num); });
    }
  }
});

/**
 * Arccosine
 * @arguments _none_
 */
sc.define("acos", {
  Number: function() {
    return Math.acos(this);
  },
  Array: function() {
    return this.map(function(x) { return x.acos(); });
  }
});

/**
 * Adds an item to an Array if there is space. This method may return a new Array.
 * @arguments _(item)_
 * @example
 *  [1,2,3].add(4); // => [ 1, 2, 3, 4 ]
 */
sc.define("add", {
  Array: function(item) {
    var ret = this.slice();
    ret.push(item);
    return ret;
  }
});

/**
 * Adds all the elements of *items* to the contents of the receiver. This method may return a new Array.
 * @arguments _(items)_
 * @example
 *  [1, 2, 3, 4].addAll([7, 8, 9]); // => [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
 */
sc.define(["addAll", "concat", "++"], {
  Array: function(items) {
    return this.concat(items);
  }
});

/**
 * Inserts the *item* before the contents of the receiver, possibly returning a new Array.
 * @arguments _(item)_
 * @example
 *  [1, 2, 3, 4].addFirst(999); // [ 999, 2, 3, 4 ]
 */
sc.define("addFirst", {
  Array: function(item) {
    return [item].concat(this);
  }
});

sc.define("addIfNotNil", {
  Array: function(item) {
    if (item !== null) {
      return this.concat([item]);
    }
    return this;
  }
});

/**
 * 0 when b <= 0, a*b when b > 0
 * @arguments _(number)_
 */
sc.define("amclip", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.amclip(num); }, this);
    }
    return this * 0.5 * (num + Math.abs(num));
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.amclip(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.amclip(num); });
    }
  }
});

/**
 * Convert a linear amplitude to decibels.
 * @arguments _none_
 * @example
 *  [0.5, 1, 2].ampdb(); // => [ -6.0205, 0, 6.0205 ]
 */
sc.define("ampdb", {
  Number: function() {
    return Math.log(this) * Math.LOG10E * 20;
  },
  Array: function() {
    return this.map(function(x) { return x.ampdb(); });
  }
});

/**
 * Answer whether *function* answers True for any item in the receiver. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 * @example
 *  [1, 2, 3, 4].any("even"); // => true
 *  [1, 2, 3, 4].any(function(x) { return x > 10; }); // => false
 */
sc.define("any", {
  Array: function(func) {
    func = sc.func(func);
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) { return true; }
    }
    return false;
  }
});

/**
 * Returns a new Array base upon *this*
 * @arguments _none_
 * @example
 *  (1).asArray(); // => [ 1 ]
 *  [1, 2, 3].asArray(); // => [ 1, 2, 3 ]
 */
sc.define("asArray", function() {
  var asArray = function() {
    return [this];
  };
  return {
    Number : asArray,
    Boolean: asArray,
    Array: function() {
      return this.slice();
    },
    String  : asArray,
    Function: asArray
  };
});

/**
 * Returns a new Boolean based upon *this*
 * @arguments _none_
 * @example
 *  (0).asBoolean(); // false
 *  (1).asBoolean(); // true
 *  [ ].asBoolean(); // false
 *  [0].asBoolean(); // true
 */
sc.define("asBoolean", {
  Number: function() {
    return (this) !== 0;
  },
  Boolean: function() {
    return this;
  },
  Array: function() {
    return this.length > 0;
  },
  String: function() {
    return this === "true";
  },
  Function: function() {
    return true;
  }
});

/**
 * @arguments _none_
 * @example
 *  "0.5".asFloat(); // => 0.5
 *  [1, 2, 3.14].asFloat(); // => [1, 2, 3.14]
 */
sc.define("asFloat", {
  Number: function() {
    return this;
  },
  Array: function() {
    return this.map(function(x) { return x.asFloat(); });
  },
  String: function() {
    return +this;
  }
});

/**
 * Returns a new Float32Array based upon *this*
 */
sc.define("asFloat32Array", {
  Array: function() {
    return new Float32Array(this);
  }
});

/**
 * Returns a new Float64Array based upon *this*
 */
sc.define("asFloat64Array", {
  Array: function() {
    return new Float64Array(this);
  }
});

/**
 * Returns a new Function based upon *this*
 * @arguments _none_
 * @example
 *  (1).asFunction()(); // => 1
 */
sc.define("asFunction", function() {
  var asFunction = function() {
    var that = this;
    return function() { return that; };
  };
  return {
    Number: asFunction,
    Array : asFunction,
    String: asFunction,
    Function: function() {
      return this;
    }
  };
});

/**
 * Returns a new Int16Array based upon *this*
 */
sc.define("asInt16Array", {
  Array: function() {
    return new Int16Array(this);
  }
});

/**
 * Returns a new Int32Array based upon *this*
 */
sc.define("asInt32Array", {
  Array: function() {
    return new Int32Array(this);
  }
});

/**
 * Returns a new Int8Array based upon *this*
 */
sc.define("asInt8Array", {
  Array: function() {
    return new Int8Array(this);
  }
});

/**
 * @arguments _none_
 * @example
 *  "0.5".asInteger(); // => 0
 *  [1, 2, 3.14].asInteger(); // => [1, 2, 3]
 */
sc.define("asInteger", {
  Number: function() {
    return this|0;
  },
  Array: function() {
    return this.map(function(x) { return x.asInteger(); });
  },
  String: function() {
    return this|0;
  }
});

/**
 * Returns new a JSON string based upon *this*
 * @arguments _none_
 */
sc.define("asJSON", function() {
  var asJSON = function() {
    return JSON.stringify(this);
  };
  return {
    Number : asJSON,
    Boolean: asJSON,
    Array  : asJSON,
    String : asJSON
  };
});

/**
 * Returns new a Number based upon *this*
 * @arguments _none_
 * @example
 *  (true).asNumber(); // => 1
 *  ["a", 10, 3.14].asNumber(); => 10
 */
sc.define("asNumber", {
  Number: function() {
    return this;
  },
  Boolean: function() {
    return this ? 1 : 0;
  },
  Array: function() {
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (typeof this[i] === "number") { return this[i]; }
    }
    return 0;
  },
  String: function() {
    return isNaN(+this) ? 0 : +this;
  },
  Function: function() {
    return 0;
  }
});

/**
 * Returns a new String based upon *this*
 */
sc.define("asString", function() {
  var asString = function() {
    return this.toString();
  };
  return {
    Number  : asString,
    Boolean : asString,
    Array   : asString,
    String  : asString,
    Function: asString
  };
});

/**
 * Returns a new Uint16Array based upon *this*
 */
sc.define("asUint16Array", {
  Array: function() {
    return new Uint16Array(this);
  }
});

/**
 * Returns a new Uint32Array based upon *this*
 */
sc.define("asUint32Array", {
  Array: function() {
    return new Uint32Array(this);
  }
});

/**
 * Returns a new Uint8Array based upon *this*
 */
sc.define("asUint8Array", {
  Array: function() {
    return new Uint8Array(this);
  }
});

/**
 * Arcsine
 * @arguments _none_
 */
sc.define("asin", {
  Number: function() {
    return Math.asin(this);
  },
  Array: function() {
    return this.map(function(x) { return x.asin(); });
  }
});

/**
 * Return the item at *index*.
 * @arguments _(index)_
 * @example
 *  x = [10,20,30];
 *  y = [0,0,2,2,1];
 *  x.at(y); // returns [ 10, 10, 30, 30, 20 ]
 */
sc.define(["at", "@"], {
  Array: function(index) {
    if (Array.isArray(index)) {
      return index.map(function(index) {
        return this.at(index);
      }, this);
    }
    return this[index|0];
  }
});

sc.define("atDec", {
  Array: function(index, dec) {
    dec = dec === void 0 ? 1 : dec;
    return this.put(index, this.at(index).opSub(dec));
  }
});

sc.define("atInc", {
  Array: function(index, inc) {
    inc = inc === void 0 ? 1 : inc;
    return this.put(index, this.at(index).opAdd(inc));
  }
});

sc.define("atModify", {
  Array: function(index, func) {
    return this.put(index, sc.func(func)(this.at(index), index));
  }
});

/**
 * Arctangent
 * @arguments _none_
 */
sc.define("atan", {
  Number: function() {
    return Math.atan(this);
  },
  Array: function() {
    return this.map(function(x) { return x.atan(); });
  }
});

/**
 * Arctangent of ( *this* / *number* )
 * @arguments _(number)_
 */
sc.define("atan2", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.atan2(num); }, this);
    }
    return Math.atan2(this, num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.atan2(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.atan2(num); });
    }
  }
});

sc.define("biexp", {
  Number: function(inCenter, inMin, inMax, outCenter, outMin, outMax, clip) {
    if (sc.isArrayArgs(arguments, 6)) {
      return [this,inCenter,inMin,inMax,outCenter,outMin,outMax].flop().map(function(items) {
        return items[0].biexp(items[1],items[2],items[3],items[4],items[5],items[6],clip);
      });
    }
    switch (clip) {
    case "min":
      if (this <= inMin) { return outMin; }
      break;
    case "max":
      if (this >= inMax) { return outMax; }
      break;
    case "minmax":
      /* falls through */
    default:
      if (this <= inMin) { return outMin; }
      if (this >= inMax) { return outMax; }
      break;
    }
    if (this >= inCenter) {
      return this.explin(inCenter, inMax, outCenter, outMax);
    } else {
      return this.explin(inMin, inCenter, outMin, outCenter);
    }
  },
  Array: function(inCenter, inMin, inMax, outCenter, outMin, outMax, clip) {
    return this.map(function(x) { return x.biexp(inCenter, inMin, inMax, outCenter, outMin, outMax, clip); });
  }
});

sc.define("bilin", {
  Number: function(inCenter, inMin, inMax, outCenter, outMin, outMax, clip) {
    if (sc.isArrayArgs(arguments, 6)) {
      return [this,inCenter,inMin,inMax,outCenter,outMin,outMax].flop().map(function(items) {
        return items[0].bilin(items[1],items[2],items[3],items[4],items[5],items[6],clip);
      });
    }
    switch (clip) {
    case "min":
      if (this <= inMin) { return outMin; }
      break;
    case "max":
      if (this >= inMax) { return outMax; }
      break;
    case "minmax":
      /* falls through */
    default:
      if (this <= inMin) { return outMin; }
      if (this >= inMax) { return outMax; }
      break;
    }
    if (this >= inCenter) {
      return this.linlin(inCenter, inMax, outCenter, outMax);
    } else {
      return this.linlin(inMin, inCenter, outMin, outCenter);
    }
  },
  Array: function(inCenter, inMin, inMax, outCenter, outMin, outMax, clip) {
    return this.map(function(x) { return x.bilin(inCenter, inMin, inMax, outCenter, outMin, outMax, clip); });
  }
});

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

sc.define("binaryValue", {
  Number: function() {
    return this > 0 ? 1 : 0;
  },
  Array: function() {
    return this.map(function(x) { return x.binaryValue(); });
  },
  Boolean: function() {
    return this ? 1 : 0;
  }
});

/**
 * performs a bitwise and with aNumber
 * @arguments _(number)_
 */
sc.define(["bitAnd", "&"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.bitAnd(num); }, this);
    }
    return this & num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.bitAnd(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.bitAnd(num); });
    }
  }
});

/**
 * ones complement
 * @arguments _none_
 */
sc.define(["bitNot", "~"], {
  Number: function() {
    return ~this;
  },
  Array: function() {
    return this.map(function(x) { return x.bitNot(); });
  }
});

/**
 * performs a bitwise or with aNumber
 * @arguments _(number)_
 */
sc.define(["bitOr", "|"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.bitOr(num); }, this);
    }
    return this | num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.bitOr(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.bitOr(num); });
    }
  }
});

/**
 * true if bit at index aNumber is set.
 * @arguments _(bit)_
 */
sc.define("bitTest", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.bitTest(num); }, this);
    }
    return !!(this & (1 << num));
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.bitTest(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.bitTest(num); });
    }
  }
});

/**
 * Bitwise Exclusive Or
 * @arguments _(number)_
 */
sc.define(["bitXor", "^"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.bitXor(num); }, this);
    }
    return this ^ num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.bitXor(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.bitXor(num); });
    }
  }
});

/**
 * Returns a linearly interpolated value between the two closest indices.
 * @arguments _(index [, method="clipAt"])_
 * @example
 *   [2, 5, 6].blendAt(0.4); // => 3.2
 */
sc.define("blendAt", {
  Array: function(index, method) {
    if (Array.isArray(index)) {
      return index.map(function(index) {
        return this.blendAt(index, method);
      }, this);
    }
    method = method === void 0 ? "clipAt" : method;
    var i = Math.floor(index);
    var x0 = this[method](i  );
    var x1 = this[method](i+1);
    return x0 + Math.abs(index - i) * (x1 - x0);
  }
});

sc.define("bubble", {
  Array: function(depth, levels) {
    depth  = depth  === void 0 ? 0 : depth;
    levels = levels === void 0 ? 1 : levels;
    if (depth <= 0) {
      if (levels <= 1) { return [this]; }
      return [this.bubble(depth, levels-1)];
    }
    return this.map(function(item) {
      return item.bubble(depth-1, levels);
    });
  },
  Number: function(depth, levels) {
    depth  = depth  === void 0 ? 0 : depth;
    levels = levels === void 0 ? 1 : levels;
    if (levels <= 1) { return [this]; }
    return [this.bubble(depth, levels-1)];
  }
});

/**
 * next larger integer.
 * @arguments _none_
 */
sc.define("ceil", {
  Number: function() {
    return Math.ceil(this);
  },
  Array: function() {
    return this.map(function(x) { return x.ceil(); });
  }
});

/**
 * Choose an element from the collection at random.
 * @arguments _none_
 * @example
 *  [1, 2, 3, 4].choose();
 */
sc.define("choose", {
  Array: function() {
    return this[(Math.random() * this.length)|0];
  }
});

/**
 * If the receiver is less than minVal then answer minVal, else if the receiver is greater than maxVal then answer maxVal, else answer the receiver.
 * @arguments _([lo=-1, hi=1])_
 * @example
 *  [ -0.6, -0.3, 0, 0.3, 0.6 ].clip(-0.5, 0.5); // => [ -0.5, -0.3, 0, 0.3, 0.5 ]
 */
sc.define("clip", {
  Number: function(lo, hi) {
    if (sc.isArrayArgs(arguments)) {
      return [this,lo,hi].flop().map(function(items) {
        return items[0].clip(items[1], items[2]);
      });
    }
    lo = lo === void 0 ? -1 : lo;
    hi = hi === void 0 ? +1 : hi;
    return Math.max(lo, Math.min(this, hi));
  },
  Array: function(lo, hi) {
    return this.map(function(x) { return x.clip(lo, hi); });
  }
});

/**
 * clips receiver to +/- aNumber
 * @arguments _([number=1])_
 * @example
 *  [ -0.6, -0.3, 0, 0.3, 0.6 ].clip2(0.5); // => [ -0.5, -0.3, 0, 0.3, 0.5 ]
 */
sc.define("clip2", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.clip2(num); }, this);
    }
    num = num === void 0 ? 1 : num;
    return this.clip(-num, +num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.clip2(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.clip2(num); });
    }
  }
});

/**
 * Same as `at`, but values for index greater than the size of the Array will be clipped to the last index.
 * @arguments _(index)_
 * @example
 *  [ 1, 2, 3 ].clipAt(13); // => 3
 *  [ 1, 2, 3 ].clipAt([ 0, 1, 2, 3 ]); // => [ 1, 2, 3, 3 ]
 */
sc.define(["clipAt", "|@|"], {
  Array: function(index) {
    if (Array.isArray(index)) {
      return index.map(function(index) {
        return this.clipAt(index);
      }, this);
    }
    return this[(index|0).clip(0, this.length-1)];
  }
});

/**
 * Same as `wrapExtend` but the sequences "clip" (return their last element) rather than wrapping.
 * @arguments _(size)_
 * @example
 *  [ 1, 2, 3 ].clipExtend(9); // => [ 1, 2, 3, 3, 3, 3, 3, 3, 3 ]
 */
sc.define("clipExtend", {
  Array: function(size) {
    size = Math.max(0, size|0);
    if (this.length < size) {
      var a = new Array(size);
      for (var i = 0, imax = this.length; i< imax; ++i) {
        a[i] = this[i];
      }
      for (var b = a[i-1]; i < size; ++i) {
        a[i] = b;
      }
      return a;
    } else {
      return this.slice(0, size);
    }
  }
});

/**
 * Same as `put`, but values for index greater than the size of the Array will be clipped to the last index.
 * @arguments _(index, item)_
 */
sc.define("clipPut", {
  Array: function(index, item) {
    if (typeof index === "number") {
      this[index.clip(0, this.length-1)] = item;
    } else if (Array.isArray(index)) {
      index.forEach(function(index) {
        this.clipPut(index, item);
      }, this);
    }
    return this;
  }
});

/**
 * Same as `swap`, but values for index greater than the size of the Array will be clipped to the last index.
 * @arguments _(i, j)_
 */
sc.define("clipSwap", {
  Array: function(i, j) {
    i = (i|0).clip(0, this.length-1);
    j = (j|0).clip(0, this.length-1);
    var t = this[i];
    this[i] = this[j];
    this[j] = t;
    return this;
  }
});

/**
 * Separates the collection into sub-collections by separating every groupSize elements.
 * @arguments _(groupSize)_
 * @example
 *   [1, 2, 3, 4, 5, 6, 7, 8].clump(3); // => [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8 ] ]
 */
sc.define("clump", {
  Array: function(groupSize) {
    var list, sublist, i, imax;
    list = [];
    sublist = [];
    for (i = 0, imax = this.length; i < imax; ++i) {
      sublist.push(this[i]);
      if (sublist.length >= groupSize) {
        list.push(sublist);
        sublist = [];
      }
    }
    if (sublist.length > 0) {
      list.push(sublist);
    }
    return list;
  }
});

/**
 * Separates the collection into sub-collections by separating elements into groupings whose size is given by integers in the groupSizeList.
 * @arguments _(groupSizeList)_
 * @example
 *   [1, 2, 3, 4, 5, 6, 7, 8].clumps([1, 2]);
 *   // => [ [ 1 ], [ 2, 3 ], [ 4 ], [ 5, 6 ], [ 7 ], [ 8 ] ]
 */
sc.define("clumps", {
  Array: function(groupSizeList) {
    var index, list, sublist, subSize, i, imax;
    index = 0;
    list = [];
    subSize = groupSizeList[0];
    sublist = [];
    for (i = 0, imax = this.length; i < imax; ++i) {
      sublist.push(this[i]);
      if (sublist.length >= subSize) {
        index += 1;
        list.push(sublist);
        subSize = groupSizeList[index % groupSizeList.length];
        sublist = [];
      }
    }
    if (sublist.length > 0) {
      list.push(sublist);
    }
    return list;
  }
});

/**
 * Answers a Boolean which is the result of a random test whose probability of success in a range from zero to one is this.
 * @arguments _none_
 */
sc.define("coin", {
  Number: function() {
    return Math.random() < this;
  },
  Array: function() {
    return this.map(function(x) { return x.coin(); });
  }
});

/**
 * Answer a new array which consists of the results of function evaluated for each item in the collection. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 * @example
 *  [ 1, 2, 3, 4 ].collect("reciprocal"); // => [ 1, 0.5, 0.3333, 0.25 ]
 *  (3).collect(function(x) { return x * 100; }); // => [ 0, 100, 200 ]
 */
sc.define("collect", {
  Number: function(func) {
    func = sc.func(func);
    var a = new Array(this|0);
    for (var i = 0, imax = a.length; i < imax; ++i) {
      a[i] = func(i, i);
    }
    return a;
  },
  Array: function(func) {
    return this.map(sc.func(func));
  }
});

/**
 * Make a copy of the receiver. (shallow copy)
 * @arguments _none_
 */
sc.define("copy", {
  Number: function() {
    return this;
  },
  Boolean: function() {
    return this;
  },
  Array: function() {
    return this.slice();
  },
  String: function() {
    return this;
  },
  Function: function() {
    return this;
  }
});

/**
 * Return a new Array which is a copy of the indexed slots of the receiver from the start of the collection to *end*.
 * @arguments _(end)_
 */
sc.define("copyFromStart", function() {
  var copyFromStart = function(end) {
    if (Array.isArray(end)) {
      return end.map(function(end) {
        return this.copyFromStart(end);
      }, this);
    }
    end = Math.max(0, end|0);
    return this.slice(0, end + 1);
  };
  return {
    Array : copyFromStart,
    String: copyFromStart
  };
});

/**
 * Return a new Array which is a copy of the indexed slots of the receiver from *start* to *end*.
 * @arguments _(start, end)_
 * @example
 *  [1, 2, 3, 4, 5].copyRange(1, 3); // [ 2, 3, 4 ]
 */
sc.define("copyRange", function() {
  var copyRange = function(start, end) {
    if (sc.isArrayArgs(arguments)) {
      return [start, end].flop().map(function(items) {
        return this.copyRange(items[0], items[1]);
      }, this);
    }
    start = Math.max(0, start|0);
    end   = Math.max(0, end|0);
    return this.slice(start, end + 1);
  };
  return {
    Array : copyRange,
    String: copyRange
  };
});

/**
 * Return a new Array consisting of the values starting at *first*, then every step of the distance between *first* and *second*, up until *last*.
 * @arguments _(first, second, last)_
 * @example
 *   [1, 2, 3, 4, 5, 6].copySeries(0, 2, 5); // => [ 1, 3, 5 ]
 */
sc.define("copySeries", {
  Array: function(first, second, last) {
    return this.at(first.series(second, last));
  }
});

/**
 * Return a new Array which is a copy of the indexed slots of the receiver from *start* to the end of the collection
 */
sc.define("copyToEnd", function() {
  var copyToEnd = function(start) {
    if (Array.isArray(start)) {
      return start.map(function(start) {
        return this.copyToEnd(start);
      }, this);
    }
    start = Math.max(0, start|0);
    return this.slice(start);
  };
  return {
    Array : copyToEnd,
    String: copyToEnd
  };
});

/**
 * Cosine
 * @arguments _none_
 */
sc.define("cos", {
  Number: function() {
    return Math.cos(this);
  },
  Array: function() {
    return this.map(function(x) { return x.cos(); });
  }
});

/**
 * Hyperbolic cosine
 * @arguments _none_
 */
sc.define("cosh", {
  Number: function() {
    return (Math.pow(Math.E, this) + Math.pow(Math.E, -this)) * 0.5;
  },
  Array: function() {
    return this.map(function(x) { return x.cosh(); });
  }
});

/**
 * Answer the number of items for which *function* answers True. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 * @example
 *   [1, 2, 3, 4].count("even"); // => 2
 *   [1, 2, 3, 4].count(function(x, i) { return x & i; }); // => 1
 */
sc.define("count", {
  Array: function(func) {
    func = sc.func(func);
    var sum = 0;
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) { ++sum; }
    }
    return sum;
  }
});

/**
 * Convert cycles per second to MIDI note.
 * @arguments _none_
 * @returns midi note
 * @example
 *  (440).cpsmidi(); // => 69
 *  sc.Range("440, 550..880").cpsmidi(); // => [69, 72.8631, 76.0195, 78.6882, 81 ]
 */
sc.define("cpsmidi", {
  Number: function() {
    return Math.log(Math.abs(this) * 1/440) * Math.LOG2E * 12 + 69;
  },
  Array: function() {
    return this.map(function(x) { return x.cpsmidi(); });
  }
});

/**
 * Convert cycles per second to decimal octaves.
 * @arguments _none_
 * @example
 *   (440).cpsoct(); // => 4.75
 *   sc.Range("440, 550..880").cpsoct(); // => [ 4.75, 5.0719, 5.3349, 5.5573, 5.75 ]
 */
sc.define("cpsoct", {
  Number: function() {
    return Math.log(Math.abs(this) * 1/440) * Math.LOG2E + 4.75;
  },
  Array: function() {
    return this.map(function(x) { return x.cpsoct(); });
  }
});

/**
 * the cube of the number
 * @arguments _none_
 */
sc.define("cubed", {
  Number: function() {
    return this * this * this;
  },
  Array: function() {
    return this.map(function(x) { return x.cubed(); });
  }
});

/**
 * Separates the array into sub-array by randomly separating elements according to the given probability.
 * @arguments _([probability=0.5])_
 */
sc.define("curdle", {
  Array: function(probability) {
    probability = probability === void 0 ? 0.5 : probability;
    return this.separate(function() {
      return probability.coin();
    });
  }
});

/**
 * map the receiver from an assumed curve-exponential input range (inMin..inMax) to a linear output range (outMin..outMax). If the input exceeds the assumed input range.
 * @arguments _([inMin=0, inMax=1, outMin=0, outMax=1, curve=-4, clip="minmax"])_
 * @example
 *   [0, 2, 4, 6, 8, 10].curvelin(0, 10, -1, 1);
 *   // => [ -1, 0.2222, 0.2905, 0.3846, 0.5375, 1 ]
 */
sc.define("curvelin", {
  Number: function(inMin, inMax, outMin, outMax, curve, clip) {
    if (sc.isArrayArgs(arguments, 4)) {
      return [this,inMin,inMax,outMin,outMax].flop().map(function(items) {
        return items[0].curvelin(items[1],items[2],items[3],items[4],curve,clip);
      });
    }
    inMin  = inMin  === void 0 ?  0 : inMin;
    inMax  = inMax  === void 0 ?  1 : inMax;
    outMin = outMin === void 0 ?  0 : outMin;
    outMax = outMax === void 0 ?  1 : outMax;
    curve  = curve  === void 0 ? -4 : curve;
    switch (clip) {
    case "min":
      if (this <= inMin) { return outMin; }
      break;
    case "max":
      if (this >= inMax) { return outMax; }
      break;
    case "minmax":
      /* falls through */
    default:
      if (this <= inMin) { return outMin; }
      if (this >= inMax) { return outMax; }
      break;
    }
    if (Math.abs(curve) < 0.001) {
      return this.linlin(inMin, inMax, outMin, outMax);
    }
    var grow = Math.exp(curve);
    var a = (outMax - outMin) / (1.0 - grow);
    var b = outMin + a;
    var scaled = (this - inMin) / (inMax - inMin);
    return Math.log((b - scaled) / a) / curve;
  },
  Array: function(inMin, inMax, outMin, outMax, curve, clip) {
    return this.map(function(x) { return x.curvelin(inMin, inMax, outMin, outMax, curve, clip); });
  }
});

/**
 * Convert a decibels to a linear amplitude.
 * @arguments _none_
 * @example
 *   (12).dbamp(); // => 3.981071705534973
 *   [-6, -3, 0, 3, 6].dbamp(); // => [ 0.5011, 0.7079, 1, 1.412, 1.9952 ]
 */
sc.define("dbamp", {
  Number: function() {
    return Math.pow(10, this * 0.05);
  },
  Array: function() {
    return this.map(function(x) { return x.dbamp(); });
  }
});

/**
 * converts degree to radian
 * @arguments _none_
 */
sc.define("degrad", {
  Number: function() {
    return this * Math.PI / 180;
  },
  Array: function() {
    return this.map(function(x) { return x.degrad(); });
  }
});

/**
 * @arguments _(scale [, stepsPerOctave=12])_
 */
sc.define("degreeToKey", {
  Number: function(scale, stepsPerOctave) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    var scaleDegree = this.round()|0;
    var accidental = (this - scaleDegree) * 10;
    return scale.performDegreeToKey(scaleDegree, stepsPerOctave, accidental);
  },
  Array: function(scale, stepsPerOctave) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    return this.map(function(scaleDegree) {
      return scaleDegree.degreeToKey(scale, stepsPerOctave);
    });
  }
});

sc.define("delimit", {
  Array: function(func) {
    var list, sublist, i, imax;
    func = func === void 0 ? sc.func(true) : sc.func(func);
    list = [];
    sublist = [];
    for (i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) {
        list.push(sublist);
        sublist = [];
      } else {
        sublist.push(this[i]);
      }
    }
    list.push(sublist);
    return list;
  }
});

/**
 * Answer the first item in the receiver for which *function* answers True. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 * @example
 *  [1, 2, 3, 4].detect("even"); // => 2
 *  [1, 2, 3, 4].detect(function(x, i) { return x & i; }); // => 3
 */
sc.define("detect", {
  Array: function(func) {
    func = sc.func(func);
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) { return this[i]; }
    }
    return null;
  }
});

/**
 * Similar to `detect` but returns the index instead of the item itself.
 * @arguments _(function)_
 */
sc.define("detectIndex", {
  Array: function(func) {
    func = sc.func(func);
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) { return i; }
    }
    return -1;
  }
});

/**
 * Return the set of all items which are elements of this, but not of *that*.
 * @arguments _(that)_
 * @example
 *  [1, 2, 3].difference([2, 3, 4, 5]); // => [ 1 ]
 */
sc.define("difference", {
  Array: function(that) {
    return this.slice().removeAll(that);
  }
});

/**
 * Returns an array with the pairwise difference between all elements.
 * @arguments _none_
 * @example
 *   [3, 4, 1, 1].differentiate(); // => [ 3, 1, -3, 0 ]
 */
sc.define("differentiate", {
  Array: function() {
    var prev = 0;
    return this.map(function(item) {
      var ret = item - prev;
      prev = item;
      return ret;
    });
  }
});

/**
 * (a * a) - (b * b)
 * @arguments _(number)_
 */
sc.define("difsqr", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.difsqr(num); }, this);
    }
    return this * this - num * num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.difsqr(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.difsqr(num); });
    }
  }
});

/**
 * a nonlinear distortion function.
 * @arguments _none_
 * @example
 *   (1).distort(); // => 0.5
 *   [0, 1, 5, 10].distort(); // => [ 0, 0.5, 0.8333, 0.9090 ]
 */
sc.define("distort", {
  Number: function() {
    return this / (1 + Math.abs(this));
  },
  Array: function() {
    return this.map(function(x) { return x.distort(); });
  }
});

/**
 * Integer Division
 * @arguments _(number)_
 * @example
 *  (10).div(3);       // => 3
 *  [10,20,30].div(3); // => [ 3, 6, 10 ]
 */
sc.define("div", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.div(num); }, this);
    }
    return Math.floor(this / num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.div(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.div(num); });
    }
  }
});

/**
 * Iterate over the elements in order, calling the function for each element. The function is passed two arguments, the element and an index.
 * @arguments _(function)_
 */
sc.define("do", {
  Number: function(func) {
    func = sc.func(func);
    var i, imax = this|0;
    for (i = 0; i < imax; ++i) {
      func(i, i);
    }
    return this;
  },
  Array: function(func) {
    this.forEach(sc.func(func));
    return this;
  }
});

/**
 * Calls function for every adjacent pair of elements in the Array. The function is passed the two adjacent elements and an index.
 * @arguments _(function)_
 */
sc.define("doAdjacentPairs", {
  Array: function(func) {
    func = sc.func(func);
    for (var i = 0, imax = this.length - 1; i < imax; ++i) {
      func(this[i], this[i+1], i);
    }
    return this;
  }
});

/**
 * Drop the first *n* items of the array. If *n* is negative, drop the last *-n* items.
 * @arguments _(number)_
 * @example
 *   [1, 2, 3, 4, 5].drop( 3); // [ 4, 5 ]
 *   [1, 2, 3, 4, 5].drop(-3); // [ 1, 2 ] 
 */
sc.define("drop", {
  Array: function(n) {
    n |= 0;
    if (n < 0) {
      return this.slice(0, this.length + n);
    } else {
      return this.slice(n);
    }
  }
});

/**
 * Duplicates the receiver *n* times.
 * @arguments _([n=2])_
 * @example
 *   (2).dup(5); // => [ 2, 2, 2, 2, 2 ]
 *   [1, 2, 3].dup(3) // => [ [1, 2, 3], [1, 2, 3], [1, 2, 3] ]
 */
sc.define("dup", function() {
  var dup = function(n) {
    n = n === void 0 ? 2 : n;
    var a = new Array(n|0);
    for (var i = 0, imax = a.length; i < imax; ++i) {
      a[i] = this;
    }
    return a;
  };
  return {
    Number : dup,
    Boolean: dup,
    Array  : function(n) {
      n = n === void 0 ? 2 : n;
      var a = new Array(n|0);
      for (var i = 0, imax = a.length; i < imax; ++i) {
        a[i] = this.slice();
      }
      return a;
    },
    String: dup,
    Function: function(n) {
      n = n === void 0 ? 2 : n;
      return Array.fill(n|0, this);
    }
  };
});

sc.define("equalWithPrecision", {
  Number: function(that, precision) {
    if (Array.isArray(that) || Array.isArray(precision)) {
      return [this,that,precision].flop().map(function(items) {
        return items[0].equalWithPrecision(items[1],items[2]);
      });
    }
    precision = precision === void 0 ? 0.0001 : precision;
    return Math.abs(this - that) < precision;
  },
  Array: function(that, precision) {
    if (Array.isArray(that)) {
      return this.map(function(x, i) { return x.equalWithPrecision(this.wrapAt(i), precision); });
    } else {
      return this.map(function(x) { return x.equalWithPrecision(that); });
    }
  }
});

sc.define(["equals", "=="], function() {
  var equals = function(arg) {
    return this === arg;
  };
  return {
    Number : equals,
    Boolean: equals,
    Array: function(arg) {
      if (!Array.isArray(arg) || this.length !== arg.length) {
        return false;
      }
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (!this[i].equals(arg[i])) {
          return false;
        }
      }
      return true;
    },
    String  : equals,
    Function: equals
  };
});

/**
 * true if dividable by 2 with no rest
 * @arguments _none_
 */
sc.define("even", {
  Number: function() {
    return (this & 1) === 0;
  },
  Array: function() {
    return this.map(function(x) { return x.even(); });
  }
});

sc.define(["every", "sc_every"], {
  Array: function(func) {
    func = sc.func(func);
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (!func(this[i], i)) { return false; }
    }
    return true;
  }
});

/**
 * Returns the difference of the receiver and its clipped form.
 * @arguments _(number)_
 */
sc.define("excess", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.excess(num); }, this);
    }
    return this - this.clip(-num, +num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.excess(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.excess(num); });
    }
  }
});

/**
 * whether the receiver is greater than minVal and less than maxVal.
 * @arguments _(lo, hi)_
 */
sc.define("exclusivelyBetween", {
  Number: function(lo, hi) {
    if (Array.isArray(lo) || Array.isArray(hi)) {
      return [this,lo,hi].flop().map(function(items) {
        return items[0].exclusivelyBetween(items[1], items[2]);
      });
    }
    return (lo <= this) && (this < hi);
  },
  Array: function(lo, hi) {
    // todo: expand
    return this.map(function(x) { return x.exclusivelyBetween(lo, hi); });
  }
});

/**
 * e to the power of the receiver.
 * @arguments _none_
 */
sc.define("exp", {
  Number: function() {
    return Math.exp(this);
  },
  Array: function() {
    return this.map(function(x) { return x.exp(); });
  }
});

/**
 * map the receiver from an assumed exponential input range (inMin..inMax) to an exponential output range (outMin..outMax). If the input exceeds the assumed input range.
 * @arguments _(inMin, inMax, outMin, outMax [, clip="minmax"])_
 */
sc.define("expexp", {
  Number: function(inMin, inMax, outMin, outMax, clip) {
    if (Array.isArray(inMin) || Array.isArray(inMax) ||
        Array.isArray(outMin) || Array.isArray(outMax)) {
      return [this,inMin,inMax,outMin,outMax].flop().map(function(items) {
        return items[0].expexp(items[1],items[2],items[3],items[4],clip);
      });
    }
    switch (clip) {
    case "min":
      if (this <= inMin) { return outMin; }
      break;
    case "max":
      if (this >= inMax) { return outMax; }
      break;
    case "minmax":
      /* falls through */
    default:
      if (this <= inMin) { return outMin; }
      if (this >= inMax) { return outMax; }
      break;
    }
    return Math.pow(outMax/outMin, Math.log(this/inMin) / Math.log(inMax/inMin)) * outMin;
  },
  Array: function(inMin, inMax, outMin, outMax, clip) {
    return this.map(function(x) { return x.expexp(inMin, inMax, outMin, outMax, clip); });
  }
});

/**
 * map the receiver from an assumed exponential input range (inMin..inMax) to a linear output range (outMin..outMax). If the input exceeds the assumed input range.
 * @arguments _(inMin, inMax, outMin, outMax [, clip="minmax"])_
 */
sc.define("explin", {
  Number: function(inMin, inMax, outMin, outMax, clip) {
    if (Array.isArray(inMin) || Array.isArray(inMax) ||
        Array.isArray(outMin) || Array.isArray(outMax)) {
      return [this,inMin,inMax,outMin,outMax].flop().map(function(items) {
        return items[0].explin(items[1],items[2],items[3],items[4],clip);
      });
    }
    switch (clip) {
    case "min":
      if (this <= inMin) { return outMin; }
      break;
    case "max":
      if (this >= inMax) { return outMax; }
      break;
    case "minmax":
      /* falls through */
    default:
      if (this <= inMin) { return outMin; }
      if (this >= inMax) { return outMax; }
      break;
    }
    return (Math.log(this/inMin)) / (Math.log(inMax/inMin)) * (outMax-outMin) + outMin;
  },
  Array: function(inMin, inMax, outMin, outMax, clip) {
    return this.map(function(x) { return x.explin(inMin, inMax, outMin, outMax, clip); });
  }
});

/**
 * Fill an Array with random values in the range *minVal* to *maxVal* with exponential distribution.
 * @arguments _(size [, minVal=0, maxVal=1])_
 * @example
 *  Array.exprand(8, 1, 100);
 */
sc.define("*exprand", {
  Array: function(size, minVal, maxVal) {
    minVal = minVal === void 0 ? 0 : minVal;
    maxVal = maxVal === void 0 ? 1 : maxVal;
    minVal = Math.max(1e-6, minVal);
    maxVal = Math.max(1e-6, maxVal);
    var a = new Array(size|0);
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = minVal.exprand(maxVal);
    }
    return a;
  }
});

/**
 * an exponentially distributed random number in the interval ]a, b[.
 * @arguments _(number)_
 */
sc.define("exprand", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.exprand(num); }, this);
    }
    return this > num ?
      num * Math.exp(Math.log(this / num) * Math.random()) :
      this * Math.exp(Math.log(num / this) * Math.random());
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.exprand(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.exprand(num); });
    }
  }
});

/**
 * Extends the object to match size by adding a number of items. If size is less than receiver size then truncate. This method may return a new Array.
 * @arguments _(size, item)_
 * @example
 *  [1, 2, 3, 4].extend(10, 9); // => [ 1, 2, 3, 4, 9, 9, 9, 9, 9, 9 ]
 */
sc.define("extend", {
  Array: function(size, item) {
    size = Math.max(0, size|0);
    var a = new Array(size);
    for (var i = 0; i < size; ++i) {
      a[i] = (i < this.length) ? this[i] : item;
    }
    return a;
  }
});

/**
 * the factorial of this.
 * @arguments _none_
 */
sc.define("factorial", {
  Number: function() {
    if (this < 0) {
      return 1;
    } else {
      return [1,1,2,6,24,120,720,5040,40320,362880,3628800,39916800,479001600][this|0];
    }
  },
  Array: function() {
    return this.map(function(x) { return x.factorial(); });
  }
});

/**
 * Fill an Array with a fibonacci series.
 * @arguments _(size [, a=0, b=1])_
 * @example
 *  Array.fib(5); // => [ 1, 1, 2, 3, 5 ]
 */
sc.define("*fib", {
  Array: function(size, x, y) {
    x = x === void 0 ? 0 : x;
    y = y === void 0 ? 1 : y;
    var a = new Array(size|0);
    for (var t, i = 0, imax = a.length; i < imax; i++) {
      a[i] = y;
      t = y;
      y = x + y;
      x = t;
    }
    return a;
  }
});

/**
 * @arguments _([a=0, b=1])_
 * @returns an array with a fibonacci series of this size beginning with a and b.
 * @example
 *  (5).fib(2, 32); // => [ 32, 34, 66, 100, 166 ]
 */
sc.define("fib", {
  Number: function(a, b) {
    if (Array.isArray(a) || Array.isArray(b)) {
      return [this,a,b].flop().map(function(items) {
        return items[0].geom(items[1], items[2]);
      });
    }
    return Array.fib(this, a, b);
  }
});

/**
 * Creates an Array of the given size, the elements of which are determined by evaluation the given function.
 * @arguments _(size [, function=nil])_
 * @example
 *  Array.fill(3, 5); // => [ 5, 5, 5 ]
 *  Array.fill(3, function(i) { return (i * 2 + 60).midicps(); });
 *  // => [ 440, 493.8833, 554.3652 ]
 */
sc.define("*fill", {
  Array: function(size, func) {
    size |= 0;
    func = sc.func(func);
    var a = new Array(size);
    for (var i = 0; i < size; i++) {
      a[i] = func(i);
    }
    return a;
  }
});

/**
 * Inserts the item into the contents of the receiver.
 * @arguments _(item)_
 * @example
 *  [1, 2, 3, 4].fill(4); // [ 4, 4, 4, 4 ]
 */
sc.define("fill", {
  Array: function(item) {
    for (var i = 0, imax = this.length; i < imax; i++) {
      this[i] = item;
    }
    return this;
  }
});

/**
 * Creates a 2 dimensional Array of the given sizes. The items are determined by evaluation of the supplied function. The function is passed row and column indexes as arguments.
 * @arguments _(rows, cols [, function=nil])_
 * @example
 *  Array.fill2D(3, 3, 1);
 *  // => [ [ 1, 1, 1 ],
 *  //      [ 1, 1, 1 ],
 *  //      [ 1, 1, 1 ] ]
 */
sc.define("*fill2D", {
  Array: function(rows, cols, func) {
    rows |= 0;
    cols |= 0;
    func = sc.func(func);
    var a, a2, row, col;
    a = new Array(rows);
    for (row = 0; row < rows; ++row) {
      a2 = a[row] = new Array(cols);
      for (col = 0; col < cols; ++col) {
        a2[col] = func(row, col);
      }
    }
    return a;
  }
});

/**
 * Creates a 3 dimensional Array of the given sizes. The items are determined by evaluation of the supplied function. The function is passed plane, row and column indexes as arguments.
 * @arguments _(planes, rows, cols [, function=nil])_
 * @example
 *  Array.fill3D(3, 3, 3, 1);
 *  // => [ [ [ 1, 1, 1 ],[ 1, 1, 1 ],[ 1, 1, 1 ] ],
 *  //      [ [ 1, 1, 1 ],[ 1, 1, 1 ],[ 1, 1, 1 ] ],
 *  //      [ [ 1, 1, 1 ],[ 1, 1, 1 ],[ 1, 1, 1 ] ] ]
 */
sc.define("*fill3D", {
  Array: function(planes, rows, cols, func) {
    planes |= 0;
    rows |= 0;
    cols |= 0;
    func = sc.func(func);
    var a, a2, a3, plane, row, col;
    a = new Array(planes);
    for (plane = 0; plane < planes; ++plane) {
      a2 = a[plane] = new Array(rows);
      for (row = 0; row < rows; ++row) {
        a3 = a2[row] = new Array(cols);
        for (col = 0; col < cols; ++col) {
          a3[col] = func(plane, row, col);
        }
      }
    }
    return a;
  }
});

/**
 * Creates a N dimensional Array where N is the size of the array *dimensions*. The items are determined by evaluation of the supplied function. The function is passed N number of indexes as arguments.
 * @arguments _(dimensions [, function=nil])_
 * @example
 *   Array.fillND([1, 2, 3, 4], function(a, b, c, d) { return a+b+c+d; }); // => 4D
 */
sc.define("*fillND", function() {
  var fillND = function(dimensions, func, args) {
    var n, a, argIndex, i;
    n = dimensions[0];
    a = [];
    argIndex = args.length;
    args = args.concat(0);
    if (dimensions.length <= 1) {
      for (i = 0; i < n; ++i) {
        args[argIndex] = i;
        a.push(func.apply(null, args));
      }
    } else {
      dimensions = dimensions.slice(1);
      for (i = 0; i < n; ++i) {
        args[argIndex] = i;
        a.push(fillND(dimensions, func, args));
      }
    }
    return a;
  };
  return {
    Array: function(dimensions, func) {
      return fillND(dimensions, sc.func(func), []);
    }
  };
});

/**
 * Finds the starting index of a number of elements contained in the array.
 * @arguments _(sublist [, offset=0])_
 * @example
 *   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].find([4, 5, 6]); // => 4
 */
sc.define("find", {
  Array: function(sublist, offset) {
    if (!Array.isArray(sublist)) {
      return -1;
    }
    offset = Math.max(0, offset|0);
    for (var i = offset, imax = this.length; i < imax; ++i) {
      var b = true;
      for (var j = 0, jmax = sublist.length; j < jmax; j++) {
        if (this[i + j] !== sublist[j]) {
          b = false;
          break;
        }
      }
      if (b) { return i; }
    }
    return -1;
  }
});

/**
 * Similar to `find` but returns an array of all the indices at which the sequence is found.
 * @arguments _(sublist [, offset=0])_
 * @example
 *   [7, 8, 7, 6, 5, 6, 7, 6, 7, 8, 9].findAll([7, 6]); // => [ 2, 6 ]
 */
sc.define("findAll", {
  Array: function(sublist, offset) {
    if (!Array.isArray(sublist)) {
      return [];
    }
    offset = Math.max(0, offset|0);
    var a = [];
    for (var i = offset, imax = this.length; i < imax; ++i) {
      var b = true;
      for (var j = 0, jmax = sublist.length; j < jmax; ++j) {
        if (this[i + j] !== sublist[j]) {
          b = false;
          break;
        }
      }
      if (b) { a.push(i); }
    }
    return a;
  }
});

/**
 * Return the first element of the collection.
 * @arguments _none_
 * @example
 *  [3, 4, 5].first(); // => 3
 */
sc.define("first", {
  Array: function() {
    return this[0];
  }
});

/**
 * Returns a collection from which all nesting has been flattened.
 * @arguments _none_
 * @example
 *   [[1, 2, 3], [[4, 5], [[6]]]].flat(); // => [ 1, 2, 3, 4, 5, 6 ]
 */
sc.define("flat", function() {
  var flat = function(that, list) {
    var i, imax;
    for (i = 0, imax = that.length; i < imax; ++i) {
      if (Array.isArray(that[i])) {
        list = flat(that[i], list);
      } else {
        list.push(that[i]);
      }
    }
    return list;
  };
  return {
    Array: function() {
      return flat(this, []);
    }
  };
});

sc.define("flatIf", {
  Array: function(func) {
    func = sc.func(func);
    var list, i, imax;
    list = [];
    for (i = 0, imax = this.length; i < imax; ++i) {
      if (Array.isArray(this[i])) {
        if (func(this[i], i)) {
          list = list.concat(this[i].flatIf(func));
        } else {
          list.push(this[i]);
        }
      } else {
        list.push(this[i]);
      }
    }
    return list;
  }
});

sc.define("flatSize", function() {
  var flatSize = function(list) {
    if (!Array.isArray(list)) {
      return 1;
    }
    var size = 0;
    for (var i = 0, imax = list.length; i < imax; ++i) {
      size += flatSize(list[i]);
    }
    return size;
  };
  return {
    Array: function() {
      return flatSize(this);
    }
  };
});

/**
 * Returns an array from which *numLevels* of nesting has been flattened.
 * @arguments _([numLevels=1])_
 * @example
 *  [[1, 2, 3], [[4, 5], [[6]]]].flatten(1); // => [ 1, 2, 3, [ 4, 5 ], [ [ 6 ] ] ]
 *  [[1, 2, 3], [[4, 5], [[6]]]].flatten(2); // => [ 1, 2, 3, 4, 5, [ 6 ] ]
 */
sc.define("flatten", {
  Array: function(numLevels) {
    var list, i, imax;
    numLevels = numLevels === void 0 ? 1 : numLevels|0;
    if (numLevels <= 0) { return this; }
    numLevels -= 1;
    list = [];
    for (i = 0, imax = this.length; i < imax; ++i) {
      if (Array.isArray(this[i])) {
        list = list.addAll(this[i].flatten(numLevels));
      } else {
        list.push(this[i]);
      }
    }
    return list;
  }
});

/**
 * next smaller integer
 * @arguments _none_
 */
sc.define("floor", {
  Number: function() {
    return Math.floor(this);
  },
  Array: function() {
    return this.map(function(x) { return x.floor(); });
  }
});

/**
 * Invert rows and colums in a two dimensional Array (turn inside out).
 * @arguments _none_
 * @example
 *  [[1, 2, 3], [4, 5, 6]].flop(); // => [ [ 1, 4 ], [ 2, 5 ], [ 3, 6 ] ]
 */
sc.define("flop", {
  Array: function() {
    var maxsize = this.reduce(function(len, sublist) {
      return Math.max(len, Array.isArray(sublist) ? sublist.length : 1);
    }, 0);
    var a = new Array(maxsize), size = this.length;
    if (size === 0) {
      a[0] = [];
    } else {
      for (var i = 0; i < maxsize; ++i) {
        var sublist = a[i] = new Array(size);
        for (var j = 0; j < size; ++j) {
          sublist[j] = Array.isArray(this[j]) ? this[j].wrapAt(i) : this[j];
        }
      }
    }
    return a;
  }
});

/**
 * the folded value, a bitwise or with aNumber
 * @arguments _(lo, hi)_
 */
sc.define("fold", {
  Number: function(lo, hi) {
    if (Array.isArray(lo) || Array.isArray(hi)) {
      return [this,lo,hi].flop().map(function(items) {
        return items[0].fold(items[1], items[2]);
      });
    }
    var _in = this, x, c, range, range2;
    x = _in - lo;
    if (_in >= hi) {
      _in = hi + hi - _in;
      if (_in >= lo) { return _in; }
    } else if (_in < lo) {
      _in = lo + lo - _in;
      if (_in < hi) { return _in; }
    } else { return _in; }

    if (hi === lo) { return lo; }
    range = hi - lo;
    range2 = range + range;
    c = x - range2 * Math.floor(x / range2);
    if (c >= range) { c = range2 - c; }
    return c + lo;
  },
  Array: function(lo, hi) {
    return this.map(function(x) { return x.fold(lo, hi); });
  }
});

/**
 * the folded value, a bitwise or with aNumber
 * @arguments _(number)_
 */
sc.define("fold2", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.fold(num); }, this);
    }
    return this.fold(-num, +num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.fold2(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.fold2(num); });
    }
  }
});

/**
 * Same as `at`, but values for *index* greater than the size of the Array will be folded back.
 * @arguments _(index)_
 * @example
 *  [ 1, 2, 3 ].foldAt(5); // => 2
 *  [ 1, 2, 3 ].foldAt([ 0, 1, 2, 3 ]); // => [ 1, 2, 3, 2 ]
 */
sc.define(["foldAt", "@|@"], {
  Array: function(index) {
    if (Array.isArray(index)) {
      return index.map(function(index) {
        return this.foldAt(index);
      }, this);
    }
    return this[(index|0).fold(0, this.length-1)];
  }
});

/**
 * Same as `wrapExtend` but the sequences fold back on the list elements.
 * @arguments _(size)_
 * @example
 *  [ 1, 2, 3 ].foldExtend(9); // => [ 1, 2, 3, 2, 1, 2, 3, 2, 1 ]
 */
sc.define("foldExtend", {
  Array: function(size) {
    size = Math.max(0, size|0);
    var a = new Array(size);
    for (var i = 0; i < size; ++i) {
      a[i] = this.foldAt(i);
    }
    return a;
  }
});

/**
 * Same as `put`, but values for index greater than the size of the Array will be folded back.
 * @arguments _(index, item)_
 */
sc.define("foldPut", {
  Array: function(index, item) {
    if (typeof index === "number") {
      this[index.fold(0, this.length-1)] = item;
    } else if (Array.isArray(index)) {
      index.forEach(function(index) {
        this.foldPut(index, item);
      }, this);
    }
    return this;
  }
});

/**
 * Same as `swap`, but the sequences fold back on the list elements.
 * @arguments _(i, j)_
 */
sc.define("foldSwap", {
  Array: function(i, j) {
    i = (i|0).fold(0, this.length-1);
    j = (j|0).fold(0, this.length-1);
    var t = this[i];
    this[i] = this[j];
    this[j] = t;
    return this;
  }
});

/**
 * Executes *function* for all integers from this to *endval*, inclusive.
 * @arguments _(endval, function)_
 */
sc.define("for", {
  Number: function(endValue, func) {
    func = sc.func(func);
    var i = this, j = 0;
    while (i <= endValue) { func(i++, j++); }
    return this;
  }
});

/**
 * Executes *function* for all integers from this to *endval*, inclusive, stepping each time by *stepval*.
 * @arguments _(endval, stepval, function)_
 */
sc.define("forBy", {
  Number: function(endValue, stepValue, func) {
    var i = this, j = 0;
    if (stepValue > 0) {
      while (i <= endValue) { func(i, j++); i += stepValue; }
    } else {
      while (i >= endValue) { func(i, j++); i += stepValue; }
    }
    return this;
  }
});

/**
 * Calls *function* for numbers from this up to endval stepping each time by a step specified by second.
 * @arguments _(second, last, function)_
 */
sc.define("forSeries", {
  Number: function(second, last, func) {
    return this.forBy(last, second - this, func);
  }
});

/**
 * fractional part
 * @arguments _none_
 */
sc.define("frac", {
  Number: function() {
    var frac = this - Math.floor(this);
    return frac < 0 ? 1 + frac : frac;
  },
  Array: function() {
    return this.map(function(x) { return x.frac(); });
  }
});

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

/**
 * map the receiver onto a gauss function.
 * @arguments _([a=1, b=0, c=1])_
 */
sc.define("gaussCurve", {
  Number: function(a, b, c) {
    a = a === void 0 ? 1 : a;
    b = b === void 0 ? 0 : b;
    c = c === void 0 ? 1 : c;
    var x = this - b;
    return a * (Math.exp((x * x) / (-2.0 * (c * c))));
  },
  Array: function(a, b, c) {
    return this.map(function(x) { return x.gaussCurve(a, b, c); });
  }
});

/**
 * Greatest common divisor
 * @arguments _(number)_
 * @example
 *  [3, 6, 9, 12, 15].gcd(100); // => [ 1, 2, 1, 4, 5 ]
 */
sc.define("gcd", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.gcd(num); }, this);
    }
    var t, a =this|0, b=num|0;
    while (b !== 0) {
      t = a % b;
      a = b;
      b = t;
    }
    return a;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.gcd(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.gcd(num); });
    }
  }
});

/**
 * Fill an Array with a geometric series.
 * @arguments (size [, start=1, grow=2])
 * @example
 *  Array.geom(5, 1, 3) // => [ 1, 3, 9, 27, 81 ]
 */
sc.define("*geom", {
  Array: function(size, start, grow) {
    start = start === void 0 ? 1 : start;
    grow  = grow  === void 0 ? 2 : grow;
    var a = new Array(size|0);
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = start;
      start *= grow;
    }
    return a;
  }
});

/**
 * @arguments (start, grow)
 * @returns an array with a geometric series of this size from start.
 * @example
 *  (5).geom(1, 3) // => [ 1, 3, 9, 27, 81 ]
 */
sc.define("geom", {
  Number: function(start, grow) {
    if (Array.isArray(start) || Array.isArray(grow)) {
      return [this,start,grow].flop().map(function(items) {
        return items[0].geom(items[1], items[2]);
      });
    }
    return Array.geom(this, start, grow);
  }
});

/**
 * greater than
 * @arguments _(number)_
 */
sc.define(["greater", ">"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.greater(num); }, this);
    }
    return this > num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.greater(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.greater(num); });
    }
  }
});

/**
 * greater or equal than
 * @arguments _(number)_
 */
sc.define(["greaterThan", ">="], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.greaterThan(num); }, this);
    }
    return this >= num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.greaterThan(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.greaterThan(num); });
    }
  }
});

sc.define("half", {
  Number: function() {
    return this * 0.5;
  },
  Array: function() {
    return this.map(function(x) { return x.half(); });
  }
});

/**
 * a value for a hanning window function between 0 and 1.
 * @arguments _none_
 */
sc.define("hanWindow", {
  Number: function() {
    if (this < 0 || this > 1) { return 0; }
    return 0.5 - 0.5 * Math.cos(this * 2 * Math.PI);
  },
  Array: function() {
    return this.map(function(x) { return x.hanWindow(); });
  }
});

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

/**
 * Square root of the sum of the squares.
 * @arguments _(number)_
 */
sc.define("hypot", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.hypot(num); }, this);
    }
    return Math.sqrt((this * this) + (num * num));
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.hypotApx(num); }, this);
    }
    var x = Math.abs(this), y = Math.abs(num);
    var minxy = Math.min(x, y);
    return x + y - (Math.sqrt(2) - 1) * minxy;
  }
});

sc.define("hypotApx", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.hypotApx(num); }, this);
    }
    var x = Math.abs(this), y = Math.abs(num);
    var minxy = Math.min(x, y);
    return x + y - (Math.sqrt(2) - 1) * minxy;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.hypotApx(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.hypotApx(num); });
    }
  }
});

/**
 * Return a boolean indicating whether the collection contains anything matching *item*.
 * @arguments _(item)_
 */
sc.define("includes", {
  Array: function(item) {
    return this.indexOf(item) !== -1;
  }
});

/**
 * Answer whether all items in *list* are contained in the receiver.
 * @arguments _(list)_
 * @example
 *  [1, 2, 3, 4].includesAll([2, 4]); // => true
 *  [1, 2, 3, 4].includesAll([4, 5]); // => false
 */
sc.define("includesAll", {
  Array: function(list) {
    for (var i = 0, imax = list.length; i < imax; ++i) {
      if (this.indexOf(list[i]) === -1) { return false; }
    }
    return true;
  }
});

/**
 * Answer whether any item in *list* is contained in the receiver.
 * @arguments _(list)_
 * @example
 *  [1, 2, 3, 4].includesAny([4, 5]); // => true
 *  [1, 2, 3, 4].includesAny([5, 6]); // => false
 */
sc.define("includesAny", {
  Array: function(list) {
    for (var i = 0, imax = list.length; i < imax; ++i) {
      if (this.indexOf(list[i]) !== -1) { return true; }
    }
    return false;
  }
});


/**
 * whether the receiver is greater than or equal to minVal and less than or equal to maxVal.
 * @arguments _(lo, hi)_
 */
sc.define("inclusivelyBetween", {
  Number: function(lo, hi) {
    if (Array.isArray(lo) || Array.isArray(hi)) {
      return [this,lo,hi].flop().map(function(items) {
        return items[0].inclusivelyBetween(items[1], items[2]);
      });
    }
    return (lo <= this) && (this <= hi);
  },
  Array: function(lo, hi) {
    // todo: expand
    return this.map(function(x) { return x.inclusivelyBetween(lo, hi); });
  }
});

/**
 * Returns the closest index of the value in the array (collection must be sorted).
 * @arguments _(item)_
 * @example
 *  [2, 3, 5, 6].indexIn(5.2); // => 2
 */
sc.define("indexIn", {
  Array: function(item) {
    var i, j = this.indexOfGreaterThan(item);
    if (j === -1) { return this.length - 1; }
    if (j ===  0) { return j; }
    i = j - 1;
    return ((item - this[i]) < (this[j] - item)) ? i : j;
  }
});

/**
 * Returns a linearly interpolated float index for the value (collection must be sorted). Inverse operation is `blendAt`.
 * @arguments _(item)_
 * @example
 *  [2, 3, 5, 6].indexInBetween(5.2); // => 2.2
 */
sc.define("indexInBetween", {
  Array: function(item) {
    var i = this.indexOfGreaterThan(item);
    if (i === -1) { return this.length - 1; }
    if (i ===  0) { return i; }
    var a = this[i-1];
    var b = this[i];
    var div = b - a;
    if (div === 0) { return i; }
    return ((item - a) / div) + i - 1;
  }
});

/**
 * Return the index of an *item* in the collection, or -1 if not found.
 * @arguments _(item [, offset=0])_
 */
sc.define(["indexOf", "sc_indexOf"], {
  Array: function(item, offset) {
    offset = offset === void 0 ? 0 : offset;
    return this.indexOf(item, offset|0);
  }
});

/**
 * Return the index of something in the collection that equals the *item*, or -1 if not found.
 * @arguments _(item [, offset=0])_
 * @example
 *  [[3], [4], [5]].indexOfEqual([5]); // => 2
 */
sc.define("indexOfEqual", {
  Array: function(item, offset) {
    offset = offset === void 0 ? 0 : offset|0;
    for (var i = offset, imax = this.length; i < imax; i++) {
      if (this[i].equals(item)) { return i; }
    }
    return -1;
  }
});

/**
 * Return the first index containing an *item* which is greater than *item*.
 * @arguments _(item)_
 * @example
 *  [10, 5, 77, 55, 12, 123].indexOfGreaterThan(70); // => 2
 */
sc.define("indexOfGreaterThan", {
  Array: function(item) {
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (this[i] > item) { return i; }
    }
    return -1;
  }
});

/**
 * Return an array of indices of things in the collection that equal the *item*, or [] if not found.
 * @arguments _(item [, offset=0])_
 * @example
 *  [7, 8, 7, 6, 5, 6, 7, 6, 7, 8, 9].indicesOf(7); // => [ 0, 2, 6, 8 ]
 */
sc.define("indicesOf", {
  Array: function(item, offset) {
    offset = offset === void 0 ? 0 : offset|0;
    var a = [];
    for (var i = offset, imax = this.length; i < imax; i++) {
      if (this[i] === item) { a.push(i); }
    }
    return a;
  }
});

/**
 * Same as `indicesOf`, but use `equals` method.
 * @arguments _(item [, offset=0])_
 * @example
 *  [[7], [8], [5], [6], 7, 6, [7], 9].indicesOfEqual([7]); // => [ 0, 6 ]
 */
sc.define("indicesOfEqual", {
  Array: function(item, offset) {
    offset = offset === void 0 ? 0 : offset|0;
    var a = [];
    for (var i = offset, imax = this.length; i < imax; i++) {
      if (this[i].equals(item)) { a.push(i); }
    }
    return a;
  }
});

/**
 * reduce
 * @arguments _(thisValue, function)_
 * @example
 *   [1, 2, 3, 4, 5].inject(0, "+"); // => 15
 */
sc.define("inject", {
  Array: function(thisValue, func) {
    return this.reduce(sc.func(func), thisValue);
  }
});

/**
 * reduce right
 * @arguments _(thisValue, function)_
 * @example
 *   [1, 2, 3, 4, 5].injectr([], "++"); // => [ 5, 4, 3, 2, 1 ]
 */
sc.define("injectr", {
  Array: function(thisValue, func) {
    return this.reduceRight(sc.func(func), thisValue);
  }
});

/**
 * Inserts the *item* into the contents of the receiver. This method may return a new Array.
 * @arguments _(index, item)_
 * @example
 *  [1, 2, 3, 4].insert(1, 999); // [ 1, 999, 3, 4 ]
 */
sc.define("insert", {
  Array: function(index, item) {
    index = Math.max(0, index|0);
    var ret = this.slice();
    ret.splice(index, 0, item);
    return ret;
  }
});

sc.define("instill", {
  Array: function(index, item, defaultValue) {
    var res;
    index = Math.max(0, index|0);
    if (index >= this.length) {
      res = this.extend(index + 1, defaultValue);
    } else {
      res = this.slice();
    }
    res[index] = item;
    return res;
  }
});

/**
 * Fill an `Array` with the interpolated values between the *start* and *end* values.
 * @arguments _(size [, start=0, end=1])_
 * @example
 *  Array.interpolation(5, 3.2, 20.5); // => [3.2, 7.525, 11.850, 16.175, 20.5]
 */
sc.define("*interpolation", {
  Array: function(size, start, end) {
    start = start === void 0 ? 0 : start;
    end   = end   === void 0 ? 1 : end;
    if (size === 1) {
      return [start];
    }
    var a = new Array(size|0);
    var step = (end - start) / (size - 1);
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = start + (i * step);
    }
    return a;
  }
});

sc.define("invert", {
  Array: function(axis) {
    var index;
    if (this.length === 0) { return []; }
    if (typeof axis === "number") {
      index = axis * 2;
    } else {
      index = this.minItem() + this.maxItem();
    }
    return index.opSub(this);
  }
});

/**
 * Checks if the receiver is an array.
 */
sc.define("isArray", {
  Number: function() {
    return false;
  },
  Boolean: function() {
    return false;
  },
  Array: function() {
    return true;
  },
  String: function() {
    return false;
  },
  Function: function() {
    return false;
  }
});

/**
 * Checks if the receiver is a boolean value.
 */
sc.define("isBoolean", {
  Number: function() {
    return false;
  },
  Boolean: function() {
    return true;
  },
  Array: function() {
    return false;
  },
  String: function() {
    return false;
  },
  Function: function() {
    return false;
  }
});

/**
 * Checks if the receiver is empty.
 */
sc.define("isEmpty", {
  Array: function() {
    return this.length === 0;
  }
});

/**
 * Checks if the receiver is a function.
 */
sc.define("isFunction", {
  Number: function() {
    return false;
  },
  Boolean: function() {
    return false;
  },
  Array: function() {
    return false;
  },
  String: function() {
    return false;
  },
  Function: function() {
    return true;
  }
});

/**
 * Checks if the receiver is `NaN`.
 */
sc.define("isNaN", {
  Number: function() {
    return isNaN(this);
  },
  Array: function() {
    return this.map(function(x) { return x.isNaN(); });
  }
});

/**
 * Checks if the receiver is < 0.
 */
sc.define("isNegative", {
  Number: function() {
    return this < 0;
  },
  Array: function() {
    return this.map(function(x) { return x.isNegative(); });
  }
});

/**
 * Checks if the receiver is a number.
 */
sc.define("isNumber", {
  Number: function() {
    return true;
  },
  Boolean: function() {
    return false;
  },
  Array: function() {
    return false;
  },
  String: function() {
    return false;
  },
  Function: function() {
    return false;
  }
});

/**
 * Checks if the receiver is >= 0.
 */
sc.define("isPositive", {
  Number: function() {
    return this >= 0;
  },
  Array: function() {
    return this.map(function(x) { return x.isPositive(); });
  }
});

/**
 * the whether the receiver is a power of two.
 */
sc.define("isPowerOfTwo", {
  Number: function() {
    var a = Math.log(this) / Math.log(2);
    var b = a|0;
    return a === b;
  },
  Array: function() {
    return this.map(function(x) { return x.isPowerOfTwo(); });
  }
});

/**
 * Checks if the receiver is > 0.
 */
sc.define("isStrictlyPositive", {
  Number: function() {
    return this > 0;
  },
  Array: function() {
    return this.map(function(x) { return x.isStrictlyPositive(); });
  }
});

/**
 * Checks if the receiver is a string.
 */
sc.define("isString", {
  Number: function() {
    return false;
  },
  Boolean: function() {
    return false;
  },
  Array: function() {
    return false;
  },
  String: function() {
    return true;
  },
  Function: function() {
    return false;
  }
});

/**
 * Returns True if all elements of this are also elements of *that*
 * @arguments _(that)_
 * @example
 *  [1, 2].isSubsetOf([ 1, 2, 3, 4]); // => true
 *  [1, 5].isSubsetOf([ 1, 2, 3, 4]); // => false
 */
sc.define("isSubsetOf", {
  Array: function(that) {
    return that.includesAll(this);
  }
});

sc.define("iwrap", {
  Number: function(lo, hi) {
    if (Array.isArray(lo) || Array.isArray(hi)) {
      return [this,lo,hi].flop().map(function(items) {
        return items[0].iwrap(items[1], items[2]);
      });
    }
    var _in = this|0, b2, c;
    lo |= 0;
    hi |= 0;
    if (lo <= hi) {
      if (lo <= _in && _in <= hi) {
        return _in;
      }
      b2 = hi - lo + 1;
      c  = (_in - lo) % b2;
      if (c < 0) { c += b2; }
      return c + lo;
    }
  },
  Array: function(lo, hi) {
    return this.map(function(x) { return x.iwrap(lo, hi); });
  }
});

/**
 * Keep the first *n* items of the array. If *n* is negative, keep the last *-n* items.
 * @arguments _(n)_
 * @example
 *  [1, 2, 3, 4, 5].keep( 3); // => [ 1, 2, 3 ]
 *  [1, 2, 3, 4, 5].keep(-3); // => [ 3, 4, 5 ]
 */
sc.define("keep", {
  Array: function(n) {
    n |= 0;
    if (n < 0) {
      return this.slice(this.length + n);
    } else {
      return this.slice(0, n);
    }
  }
});

/**
 * inverse of degreeToKey.
 * @arguments _(scale [, stepsPerOctave=12])_
 * @example
 *  l = [0, 1, 5, 9, 11]; // pentatonic scale
 *  sc.Range("60..73").collect(function(i) { return i.keyToDegree(l); });
 *  // => [ 25, 26, 26.25, 26.5, 26.75, 27, 27.25, 27.5, 27.75, 28, 28.5, 29, 30, 31 ]
 */
sc.define("keyToDegree", {
  Number: function(scale, stepsPerOctave) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    return scale.performKeyToDegree(this, stepsPerOctave);
  },
  Array: function(scale, stepsPerOctave) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    return this.map(function(val) {
      return val.keyToDegree(scale, stepsPerOctave);
    });
  }
});

/**
 * Returns a new Array whose elements are interlaced sequences of the elements of the receiver's subcollections, up to size length. The receiver is unchanged.
 * @arguments _(size)_
 * @example
 *  [[1, 2, 3], [0]].lace(10); // => [ 1, 0, 2, 0, 3, 0, 1, 0, 2, 0 ]
 */
sc.define("lace", {
  Array: function(size) {
    size = Math.max(1, size|0);
    var a = new Array(size);
    var v, wrap = this.length;
    for (var i = 0; i < size; ++i) {
      v = this[i % wrap];
      a[i] = Array.isArray(v) ? v[ ((i/wrap)|0) % v.length ] : v;
    }
    return a;
  }
});

/**
 * Return the last element of the collection.
 * @arguments _none_
 * @example
 *  [3, 4, 5].last(); // => 5
 */
sc.define("last", {
  Array: function() {
    return this[this.length-1];
  }
});

sc.define("lastForWhich", {
  Array: function(func) {
    func = sc.func(func);
    var prev = null;
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) {
        prev = this[i];
      } else {
        return prev;
      }
    }
    return prev;
  }
});

sc.define("lastIndex", {
  Array: function() {
    return this.length - 1;
  }
});

sc.define("lastIndexForWhich", {
  Array: function(func) {
    func = sc.func(func);
    var prev = -1;
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) {
        prev = i;
      } else {
        return prev;
      }
    }
    return prev;
  }
});

/**
 * Least common multiple
 * @arguments _(number)_
 * @example
 *    [3, 6, 12, 24, 48].lcm(20); // => [ 60, 60, 60, 120, 240 ]
 */
sc.define("lcm", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.lcm(num); }, this);
    }
    return Math.abs(this * num) / this.gcd(num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.lcm(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.lcm(num); });
    }
  }
});

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

/**
 * performs a binary left shift
 * @arguments _(number)_
 */
sc.define(["leftShift", "<<"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.leftShift(num); }, this);
    }
    return this << num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.leftShift(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.leftShift(num); });
    }
  }
});

/**
 * less than
 * @arguments _(number)_
 */
sc.define(["less", "<"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.less(num); }, this);
    }
    return this < num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.less(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.less(num); });
    }
  }
});

/**
 * smaller or equal than
 * @arguments _(number)_
 */
sc.define(["lessThan", "<="], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.lessThan(num); }, this);
    }
    return this <= num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.lessThan(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.lessThan(num); });
    }
  }
});

/**
 * map the receiver from an assumed linear input range (inMin..inMax) to an exponential curve output range (outMin..outMax).
 * @arguments _([inMin=0, inMax=1, outMin=0, outMax=1, curve=-4, clip="minmax"])_
 */
sc.define("lincurve", {
  Number: function(inMin, inMax, outMin, outMax, curve, clip) {
    if (Array.isArray(inMin) || Array.isArray(inMax) ||
        Array.isArray(outMin) || Array.isArray(outMax)) {
      return [this,inMin,inMax,outMin,outMax].flop().map(function(items) {
        return items[0].lincurve(items[1],items[2],items[3],items[4],curve,clip);
      });
    }
    inMin  = inMin  === void 0 ?  0 : inMin;
    inMax  = inMax  === void 0 ?  1 : inMax;
    outMin = outMin === void 0 ?  0 : outMin;
    outMax = outMax === void 0 ?  1 : outMax;
    curve  = curve  === void 0 ? -4 : curve;
    switch (clip) {
    case "min":
      if (this <= inMin) { return outMin; }
      break;
    case "max":
      if (this >= inMax) { return outMax; }
      break;
    case "minmax":
      /* falls through */
    default:
      if (this <= inMin) { return outMin; }
      if (this >= inMax) { return outMax; }
      break;
    }
    if (Math.abs(curve) < 0.001) {
      return this.linlin(inMin, inMax, outMin, outMax);
    }
    var grow = Math.exp(curve);
    var a = (outMax - outMin) / (1.0 - grow);
    var b = outMin + a;
    var scaled = (this - inMin) / (inMax - inMin);
    return b - (a * Math.pow(grow, scaled));
  },
  Array: function(inMin, inMax, outMin, outMax, curve, clip) {
    return this.map(function(x) { return x.lincurve(inMin, inMax, outMin, outMax, curve, clip); });
  }
});

/**
 * map the receiver from an assumed linear input range (inMin..inMax) to an exponential output range (outMin..outMax).
 * @arguments _([inMin=0, inMax=1, outMin=0, outMax=1, clip="minmax"])_
 */
sc.define("linexp", {
  Number: function(inMin, inMax, outMin, outMax, clip) {
    if (Array.isArray(inMin) || Array.isArray(inMax) ||
        Array.isArray(outMin) || Array.isArray(outMax)) {
      return [this,inMin,inMax,outMin,outMax].flop().map(function(items) {
        return items[0].linexp(items[1],items[2],items[3],items[4],clip);
      });
    }
    switch (clip) {
    case "min":
      if (this <= inMin) { return outMin; }
      break;
    case "max":
      if (this >= inMax) { return outMax; }
      break;
    case "minmax":
      /* falls through */
    default:
      if (this <= inMin) { return outMin; }
      if (this >= inMax) { return outMax; }
      break;
    }
    return Math.pow(outMax/outMin, (this-inMin)/(inMax-inMin)) * outMin;
  },
  Array: function(inMin, inMax, outMin, outMax, clip) {
    return this.map(function(x) { return x.linexp(inMin, inMax, outMin, outMax, clip); });
  }
});

/**
 * map the receiver from an assumed linear input range to a linear output range.
 * @arguments _([inMin=0, inMax=1, outMin=0, outMax=1, clip="minmax"])_
 */
sc.define("linlin", {
  Number: function(inMin, inMax, outMin, outMax, clip) {
    if (Array.isArray(inMin) || Array.isArray(inMax) ||
        Array.isArray(outMin) || Array.isArray(outMax)) {
      return [this,inMin,inMax,outMin,outMax].flop().map(function(items) {
        return items[0].linlin(items[1],items[2],items[3],items[4],clip);
      });
    }
    switch (clip) {
    case "min":
      if (this <= inMin) { return outMin; }
      break;
    case "max":
      if (this >= inMax) { return outMax; }
      break;
    case "minmax":
      /* falls through */
    default:
      if (this <= inMin) { return outMin; }
      if (this >= inMax) { return outMax; }
      break;
    }
    return (this-inMin)/(inMax-inMin) * (outMax-outMin) + outMin;
  },
  Array: function(inMin, inMax, outMin, outMax, clip) {
    return this.map(function(x) { return x.linlin(inMin, inMax, outMin, outMax, clip); });
  }
});

/**
 * Fill an Array with random values in the range *minVal* to *maxVal* with a linear distribution.
 * @arguments _(size [, minVal=0, maxVal=1])_
 * @example
 *  Array.linrand(8, 1, 100);
 */
sc.define("*linrand", {
  Array: function(size, minVal, maxVal) {
    minVal = minVal === void 0 ? 0 : minVal;
    maxVal = maxVal === void 0 ? 1 : maxVal;
    var a = new Array(size|0);
    var range = maxVal - minVal;
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = minVal + range.linrand();
    }
    return a;
  }
});

/**
 * @arguments _none_
 * @returns a linearly distributed random number from zero to this.
 * @example
 *  (10).linrand();
 */
sc.define("linrand", {
  Number: function() {
    return Math.min(Math.random(), Math.random()) * this;
  },
  Array: function() {
    return this.map(function(x) { return x.linrand(); });
  }
});

/**
 * Base e logarithm.
 * @arguments _none_
 */
sc.define("log", {
  Number: function() {
    return Math.log(this);
  },
  Array: function() {
    return this.map(function(x) { return x.log(); });
  }
});

/**
 * Base 10 logarithm.
 * @arguments _none_
 */
sc.define("log10", {
  Number: function() {
    return Math.log(this) * Math.LOG10E;
  },
  Array: function() {
    return this.map(function(x) { return x.log10(); });
  }
});

/**
 * Base 2 logarithm.
 * @arguments _none_
 */
sc.define("log2", {
  Number: function() {
    return Math.log(Math.abs(this)) * Math.LOG2E;
  },
  Array: function() {
    return this.map(function(x) { return x.log2(); });
  }
});

sc.define("log2Ceil", {
  Number: function() {
    if (this <= 0) {
      return Math.ceil(Math.log(0x100000000 + (this|0)) / Math.log(2));
    } else if (this > 0) {
      return Math.ceil(Math.log(this|0) / Math.log(2));
    }
  },
  Array: function() {
    return this.map(function(x) { return x.log2Ceil(); });
  }
});

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

/**
 * Maximum
 * @arguments _(number)_
 */
sc.define("max", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.max(num); }, this);
    }
    return Math.max(this, num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.max(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.max(num); });
    }
  }
});

/**
 * Returns the maximum depth of all subarrays.
 * @arguments _none_
 * @example
 * [[1, 2, 3], [[41, 52], 5, 6], 1, 2, 3].maxDepth(); // => 3
 */
sc.define("maxDepth", function() {
  var maxDepth = function(that, max) {
    var res, i, imax;
    res = max;
    for (i = 0, imax = that.length; i < imax; ++i) {
      if (Array.isArray(that[i])) {
        res = Math.max(res, maxDepth(that[i], max+1));
      }
    }
    return res;
  };
  return {
    Array: function() {
      return maxDepth(this, 1);
    }
  };
});

/**
 * Answer the index of the maximum of the results of *function* evaluated for each item in the receiver. The function is passed two arguments, the item and an integer index. If function is nil, then answer the maximum of all items in the receiver.
 * @arguments _([func=nil])_
 * @example
 *  [3.2, 12.2, 13, 0.4].maxIndex(); // => 2
 */
sc.define("maxIndex", {
  Array: function(func) {
    var i, imax, maxValue, maxIndex, val;
    maxIndex = -1;
    if (func) {
      func = sc.func(func);
      for (i = 0, imax = this.length; i < imax; ++i) {
        val = func(this[i], i);
        if (i === 0) {
          maxValue = val;
          maxIndex = 0;
        } else if (val > maxValue) {
          maxValue = val;
          maxIndex = i;
        }
      }
    } else {
      // optimized version if no function
      val = this[0];
      maxValue = val;
      maxIndex = 0;
      for (i = 1, imax = this.length; i < imax; ++i) {
        val = this[i];
        if (val > maxValue) {
          maxValue = val;
          maxIndex = i;
        }
      }
    }
    return maxIndex;
  }
});

/**
 * Returns the maximum size of all subarrays at a certain depth (dimension)
 * @arguments _(rank)_
 */
sc.define("maxSizeAtDepth", {
  Array: function(rank) {
    var maxsize = 0, sz, i, imax;
    if (rank === 0 || rank === void 0) { return this.length; }
    for (i = 0, imax = this.length; i < imax; ++i) {
      sz = Array.isArray(this[i]) ? this[i].maxSizeAtDepth(rank-1) : 1;
      if (sz > maxsize) { maxsize = sz; }
    }
    return maxsize;
  }
});

/**
 * Answer the maximum of the results of *function* evaluated for each item in the receiver. The function is passed two arguments, the item and an integer index.
 * @arguments _([function=nil])_
 * @example
 *  [ 1, 5, 2, 4, 3 ].maxValue(); // => 5
 */
sc.define(["maxValue", "maxItem"], {
  Array: function(func) {
    var i, imax, maxValue, maxElement, val;
    if (func) {
      func = sc.func(func);
      for (i = 0, imax = this.length; i < imax; ++i) {
        val = func(this[i], i);
        if (i === 0) {
          maxValue = val;
          maxElement = this[i];
        } else if (val > maxValue) {
          maxValue = val;
          maxElement = this[i];
        }
      }
    } else {
      // optimized version if no function
      val = this[0];
      maxValue = val;
      maxElement = this[0];
      for (i = 1, imax = this.length; i < imax; ++i) {
        val = this[i];
        if (val > maxValue) {
          maxValue = val;
          maxElement = this[i];
        }
      }
    }
    return maxElement;
  }
});

sc.define("mean", {
  Array: function(func) {
    if (func) { func = sc.func(func); }
    return this.sum(func) / this.length;
  }
});

sc.define("middle", {
  Array: function() {
    return this[(this.length - 1) >> 1];
  }
});

sc.define("middleIndex", {
  Array: function() {
    return (this.length - 1) >> 1;
  }
});

/**
 * Convert MIDI note to cycles per second
 * @returns cycles per second
 * @example
 *  (69).midicps(); // => 440
 *  sc.Range("69..81").midicps(); // => [ 440, 466.1637, ... , 830.6093, 880 ]
 */
sc.define("midicps", {
  Number: function() {
    return 440 * Math.pow(2, (this - 69) * 1/12);
  },
  Array: function() {
    return this.map(function(x) { return x.midicps(); });
  }
});

/**
 * Convert an interval in semitones to a ratio.
 * @arguments _none_
 * @returns a ratio
 * @example
 *  sc.Range("0..12").midiratio(); // => [1, 1.0594, ... , 1.8877, 2]
 */
sc.define("midiratio", {
  Number: function() {
    return Math.pow(2, this * 1/12);
  },
  Array: function() {
    return this.map(function(x) { return x.midiratio(); });
  }
});

/**
 * Minumum
 * @arguments _(number)_
 */
sc.define("min", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.min(num); }, this);
    }
    return Math.min(this, num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.min(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.min(num); });
    }
  }
});

/**
 * Answer the index of the minimum of the results of *function* evaluated for each item in the receiver. The function is passed two arguments, the item and an integer index. If function is nil, then answer the minimum of all items in the receiver.
 * @arguments _([function=nil])_
 * @example
 *  [3.2, 12.2, 13, 0.4].minIndex(); // => 3
 */
sc.define("minIndex", {
  Array: function(func) {
    var i, imax, minValue, minIndex, val;
    minIndex = -1;
    if (func) {
      func = sc.func(func);
      for (i = 0, imax = this.length; i < imax; ++i) {
        val = func(this[i], i);
        if (i === 0) {
          minValue = val;
          minIndex = 0;
        } else if (val < minValue) {
          minValue = val;
          minIndex = i;
        }
      }
    } else {
      // optimized version if no function
      val = this[0];
      minValue = val;
      minIndex = 0;
      for (i = 1, imax = this.length; i < imax; ++i) {
        val = this[i];
        if (val < minValue) {
          minValue = val;
          minIndex = i;
        }
      }
    }
    return minIndex;
  }
});

/**
 * Answer the minimum of the results of *function* evaluated for each item in the receiver. The function is passed two arguments, the item and an integer index.
 * @arguments _([function=nil])_
 * @example
 *  [ -1, -5, -2, -4, -3 ].minValue("abs"); // => -1
 */
sc.define(["minValue", "minItem"], {
  Array: function(func) {
    var i, imax, minValue, minElement, val;
    if (func) {
      func = sc.func(func);
      for (i = 0, imax = this.length; i < imax; ++i) {
        val = func(this[i], i);
        if (i === 0) {
          minValue = val;
          minElement = this[i];
        } else if (val < minValue) {
          minValue = val;
          minElement = this[i];
        }
      }
    } else {
      // optimized version if no function
      minElement = this[0];
      for (i = 1, imax = this.length; i < imax; ++i) {
        if (this[i] < minElement) {
          minElement = this[i];
        }
      }
    }
    return minElement;
  }
});

/**
 * Return a new Array which is the receiver made into a palindrome. The receiver is unchanged.
 * @arguments _none_
 * @example
 *  [1, 2, 3, 4].mirror(); // => [1, 2, 3, 4, 3, 2, 1]
 */
sc.define("mirror", {
  Array: function() {
    var size = this.length * 2 - 1;
    if (size < 2) {
      return this.slice(0);
    }
    var i, j, imax, a = new Array(size);
    for (i = 0, imax = this.length; i < imax; ++i) {
      a[i] = this[i];
    }
    for (j = imax - 2, imax = size; i < imax; ++i, --j) {
      a[i] = this[j];
    }
    return a;
  }
});

/**
 * Return a new Array which is the receiver made into a palindrome with the last element removed. This is useful if the list will be repeated cyclically, the first element will not get played twice. The receiver is unchanged.
 * @arguments _none_
 * @example
 *  [1, 2, 3, 4].mirror1(); // => [1, 2, 3, 4, 3, 2]
 */
sc.define("mirror1", {
  Array: function() {
    var size = this.length * 2 - 2;
    if (size < 2) {
      return this.slice(0);
    }
    var i, j, imax, a = new Array(size);
    for (i = 0, imax = this.length; i < imax; ++i) {
      a[i] = this[i];
    }
    for (j = imax - 2, imax = size; i < imax; ++i, --j) {
      a[i] = this[j];
    }
    return a;
  }
});

/**
 * Return a new Array which is the receiver concatenated with a reversal of itself. The center element is duplicated. The receiver is unchanged.
 * @arguments _none_
 * @example
 *  [1, 2, 3, 4].mirror2(); // => [1, 2, 3, 4, 4, 3, 2, 1]
 */
sc.define("mirror2", {
  Array: function() {
    var size = this.length * 2;
    if (size < 2) {
      return this.slice(0);
    }
    var i, j, imax, a = new Array(size);
    for (i = 0, imax = this.length; i < imax; ++i) {
      a[i] = this[i];
    }
    for (j = imax - 1, imax = size; i < imax; ++i, --j) {
      a[i] = this[j];
    }
    return a;
  }
});

/**
 * Integer Modulo
 * @arguments _(number)_
 * @example
 *  (10).mod(3); // => 1
 *  [10,20,30].mod(3); // => [ 1, 2, 0 ]
 */
sc.define("mod", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.mod(num); }, this);
    }
    if (this <= 0) {
      return num + Math.floor(this % num);
    } else {
      return Math.floor(this % num);
    }
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.mod(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.mod(num); });
    }
  }
});

sc.define("mode", {
  Array: function(degree, octave) {
    octave = octave === void 0 ? 12 : octave;
    return this.rotate(degree.neg()).opSub(this.wrapAt(degree)).opMod(octave);
  }
});

/**
 * the value in the list closest to this
 * @arguments _(list)_
 * @example
 *  l = [0, 0.5, 0.9, 1];
 *  sc.Range("0, 0.1..1").collect(function(i) { return i.nearestInList(l); });
 *  // => [ 0, 0, 0, 0.5, 0.5, 0.5, 0.5, 0.9, 0.9, 0.9, 1 ]
 */
sc.define("nearestInList", {
  Number: function(list) {
    return list.performNearestInList(this);
  },
  Array: function(list) {
    // collection is sorted
    return this.map(function(item) {
      return list.at(list.indexIn(item));
    });
  }
});

/**
 * the value in the collection closest to this, assuming an octave repeating table of note values.
 * @arguments _(scale [, stepsPerOctave=12])_
 * @example
 *  l = [0, 1, 5, 9, 11]; // pentatonic scale
 *  sc.Range("60, 61..76").collect(function(i) { return i.nearestInScale(l, 12); });
 *  // => [ 60, 61, 61, 65, 65, 65, 65, 69, 69, 69, 71, 71, 72, 73, 73, 77, 77 ]
 */
sc.define("nearestInScale", {
  Number: function(scale, stepsPerOctave) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    return scale.performNearestInScale(this, stepsPerOctave);
  },
  Array: function(scale, stepsPerOctave) {
    // collection is sorted
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    var root = this.trunc(stepsPerOctave);
    var key  = this.opMod(stepsPerOctave);
    return key.nearestInScale(scale).opAdd(root);
  }
});

/**
 * negation
 * @arguments _none_
 */
sc.define("neg", {
  Number: function() {
    return -this;
  },
  Array: function() {
    return this.map(function(x) { return x.neg(); });
  }
});

/**
 * the next power of aNumber
 * @arguments _(base)_
 */
sc.define("nextPowerOf", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.nextPowerOf(num); }, this);
    }
    return Math.pow(num, Math.ceil(Math.log(this) / Math.log(num)));
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.nextPowerOf(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.nextPowerOf(num); });
    }
  }
});

/**
 * the next power of three
 * @arguments _none_
 */
sc.define("nextPowerOfThree", {
  Number: function() {
    return Math.pow(3, Math.ceil(Math.log(this) / Math.log(3)));
  },
  Array: function() {
    return this.map(function(x) { return x.nextPowerOfThree(); });
  }
});

/**
 * the number relative to this that is the next power of 2
 * @arguments _none_
 */
sc.define("nextPowerOfTwo", {
  Number: function() {
    if (this <= 0) {
      return 1;
    } else {
      return Math.pow(2, Math.ceil(Math.log(this) / Math.log(2)));
    }
  },
  Array: function() {
    return this.map(function(x) { return x.nextPowerOfTwo(); });
  }
});

/**
 * Returns a new *Array* with the receiver items normalized between *min* and *max*.
 * @arguments _([min=0, max=1])_
 * @example
 *  [1, 2, 3].normalize(-20, 10); // => [ -20, -5, 10 ]
 */
sc.define("normalize", {
  Array: function(min, max) {
    min = min === void 0 ? 0 : min;
    max = max === void 0 ? 1 : max;
    var minItem = this.minItem();
    var maxItem = this.maxItem();
    return this.map(function(el) {
      return el.linlin(minItem, maxItem, min, max);
    });
  }
});

/**
 * Returns the Array resulting from `this[i] / this.sum()`, so that the array will sum to 1.0.
 * @arguments _none_
 * @example
 *  [1, 2, 3].normalizeSum(); // => [ 0.1666, 0.3333, 0.5 ]
 */
sc.define("normalizeSum", {
  Array: function() {
    return this.opDiv(this.sum());
  }
});

/**
 * Checks is the receiver is not empty.
 */
sc.define("notEmpty", {
  Array: function() {
    return this.length !== 0;
  }
});

sc.define(["notEquals", "!="], {
  Number: function(arg) {
    return this !== arg;
  },
  Array: function(arg) {
    return !this.equals(arg);
  },
  String: function(arg) {
    return this !== arg;
  },
  Function: function(arg) {
    return this !== arg;
  }
});

/**
 * number of required bits
 * @arguments _none_
 */
sc.define("numBits", {
  Number: function() {
    if (this <= 0) {
      return Math.floor(Math.log(0x100000000 + (this|0)) / Math.log(2)) + 1;
    } else if (this > 0) {
      return Math.floor(Math.log(this|0) / Math.log(2)) + 1;
    }
  },
  Array: function() {
    return this.map(function(x) { return x.numBits(); });
  }
});

sc.define("obtain", {
  Array: function(index, defaultValue) {
    if (Array.isArray(index)) {
      return index.map(function(index) {
        return this.obtain(index, defaultValue);
      }, this);
    }
    index = Math.max(0, index|0);
    if (index < this.length) {
      return this[index|0];
    }
    return defaultValue;
  }
});

/**
 * Answer the number of items in the receiver which are equal to anObject.
 * @arguments _(item)_
 * @example
 *  [1, 2, 3, 3, 4, 3, 4, 3].occurrencesOf(3); // => 4
 */
sc.define("occurrencesOf", {
  Array: function(item) {
    var sum = 0;
    for (var i = 0, imax = this.length; i < imax; ++i) {
      if (this[i] === item || this[i].equals(item)) { ++sum; }
    }
    return sum;
  }
});

/**
 * Convert decimal octaves to cycles per second.
 * @arguments _none_
 */
sc.define("octcps", {
  Number: function() {
    return 440 * Math.pow(2, this - 4.75);
  },
  Array: function() {
    return this.map(function(x) { return x.octcps(); });
  }
});

/**
 * true if not dividable by 2 with no rest
 * @arguments _none_
 */
sc.define("odd", {
  Number: function() {
    return (this & 1) === 1;
  },
  Array: function() {
    return this.map(function(x) { return x.odd(); });
  }
});

/**
 * Addition
 * @example
 *  (10).opAdd(2); // => 12
 *  [10,20,30].sc("+")(10); // => [ 20, 30, 40 ]
 */
sc.define(["opAdd", "+"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.opAdd(num); }, this);
    }
    return this + num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.opAdd(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.opAdd(num); });
    }
  }
});

/**
 * Division
 * @example
 *  (10).opDiv(2); // => 5
 *  [10,20,30].sc("/")(10); // => [ 1, 2, 3 ]
 */
sc.define(["opDiv", "/"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.opDiv(num); }, this);
    }
    return this / num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.opDiv(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.opDiv(num); });
    }
  }
});

/**
 * Modulo
 * @example
 *  (10).opMod(3); // => 1
 *  [10,20,30].sc("%")(3); // => [ 1, 2, 0 ]
 */
sc.define(["opMod", "%"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.opMod(num); }, this);
    }
    return this % num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.opMod(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.opMod(num); });
    }
  }
});

/**
 * Multiplication  
 * @example
 *  (10).opMul(2); // => 20
 *  [10,20,30].sc("*")(10); // => [ 100, 200, 300 ]
 */
sc.define(["opMul", "*"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.opMul(num); }, this);
    }
    return this * num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.opMul(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.opMul(num); });
    }
  }
});

/**
 * Subtraction
 * @example
 *  (10).opSub(2); // => 8
 *  [10,20,30].sc("-")(10); // => [ 0, 10, 20 ]
 */
sc.define(["opSub", "-"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.opSub(num); }, this);
    }
    return this - num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.opSub(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.opSub(num); });
    }
  }
});

/**
 * Calls function for each subsequent pair of elements in the Array. The function is passed the two elements and an index.
 * @arguments _(function)_
 */
sc.define(["pairsDo", "keyValuesDo"], {
  Array: function(func) {
    func = sc.func(func);
    for (var i = 0, imax = this.length; i < imax; i += 2) {
      func(this[i], this[i+1], i);
    }
    return this;
  }
});

/**
 * randomly partition a number into parts of at least min size.
 * @arguments _([parts=2, min=1])_
 * @example
 *  (75).partition(8, 3);
 */
sc.define("partition", {
  Number: function(parts, min) {
    parts = typeof parts === "undefined" ? 2 : parts;
    min = typeof min === "undefined" ? 1 : min;
    var n = this - ((min - 1) * parts);
    var a = new Array(n-1);
    for (var i = 1; i <= n-1; ++i) {
      a[i-1] = i;
    }
    return a.scramble().keep(parts-1).sort(function(a, b) {
      return a - b;
    }).add(n).differentiate().opAdd(min-1);
  }
});

sc.define("performDegreeToKey", {
  Array: function(scaleDegree, stepsPerOctave, accidental) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    accidental     = accidental     === void 0 ?  0 : accidental;
    var baseKey = (stepsPerOctave * ((scaleDegree / this.length)|0)) + this.wrapAt(scaleDegree);
    return accidental === 0 ? baseKey : baseKey + (accidental * (stepsPerOctave / 12));
  }
});

sc.define("performKeyToDegree", {
  Array: function(degree, stepsPerOctave) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    var n = ((degree / stepsPerOctave)|0) * this.length;
    var key = degree % stepsPerOctave;
    return this.indexInBetween(key) + n;
  }
});

sc.define("performNearestInList", {
  Array: function(degree) {
    return this[this.indexIn(degree)];
  }
});

sc.define("performNearestInScale", {
  Array: function(degree, stepsPerOctave) {
    stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
    var root = degree.trunc(stepsPerOctave);
    var key  = degree % stepsPerOctave;
    return this.performNearestInList(key) + root;
  }
});

/**
 * Returns a new Array whose elements are the nthPermutation of the elements of the receiver.
 * @arguments _(nthPermutation)_
 */
sc.define("permute", {
  Array: function(nthPermutation) {
    var obj1, obj2, i, j, z, size, t;
    if (Array.isArray(nthPermutation)) {
      return nthPermutation.map(function(nthPermutation) {
        return this.permute(nthPermutation);
      }, this);
    }
    obj1 = this;
    obj2 = this.slice();
    size = this.length;
    z = nthPermutation|0;
    for (i = 0; i < size-1; ++i) {
      j = i + z % (size-i);
      z = (z / (size-i))|0;
      t = obj2[i];
      obj2[i] = obj2[j];
      obj2[j] = t;
    }
    return obj2;
  }
});

/**
 * Remove and return the last element of the Array.
 * @arguments _none_
 * @example
 *  [1, 2, 3].pop(); // 3
 */
sc.define("pop", {
  Array: function() {
    return this.pop();
  }
});

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

/**
 * this to the power of aNumber
 * @arguments _(number)_
 */
sc.define(["pow", "**"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.pow(num); }, this);
    }
    return Math.pow(this ,num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.pow(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.pow(num); });
    }
  }
});

/**
 * the number relative to this that is the previous power of aNumber
 */
sc.define("previousPowerOf", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.previousPowerOf(num); }, this);
    }
    return Math.pow(num, Math.ceil(Math.log(this) / Math.log(num)) - 1);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.previousPowerOf(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.previousPowerOf(num); });
    }
  }
});

(function(sc) {
  "use strict";

  // var NUMPRIMES = 6542;
  var PRIMEMAX  = 65521;
  var primesieve = new Uint8Array(PRIMEMAX);
  var primelist  = [2];
  (function() {
    var i, p, q;
    p = 3;
    while (p <= PRIMEMAX) {
      i = (p-1)>>1;
      if (!primesieve[i]) {
        primelist.push(p);
        q = p + p + p;
        while (q < PRIMEMAX) {
          primesieve[(q-1)>>1] = 1;
          q += p + p;
        }
      }
      p += 2;
    }
  })();

  /**
   * the nth prime number. The receiver must be from 0 to 6541.
   * @arguments _none_
   * @example
   * [0, 1, 2, 3, 4, 5].nthPrime(); // => [ 2, 3, 5, 7, 11, 13 ]
   */
  sc.define("nthPrime", {
    Number: function() {
      return primelist[this|0];
    },
    Array: function() {
      return this.map(function(x) { return x.nthPrime(); });
    }
  });

  /**
   * the next prime less than or equal to the receiver up to 65521.
   * @arguments _none_
   * @example
   *  (25).prevPrime(); // => 23
   */
  sc.define("prevPrime", {
    Number: function() {
      var i, p, lo = 0, hi = primelist.length;
      var num = this|0;
      while (hi >= lo) {
        i = (lo + hi) >> 1;
        p = primelist[i];
        if (num === p) { return primelist[i]; }
        if (num < p) {
          hi = i - 1;
        } else {
          lo = i + 1;
        }
      }
      return primelist[Math.max(0, Math.min(hi, primelist.length-1))];
    },
    Array: function() {
      return this.map(function(x) { return x.prevPrime(); });
    }
  });

  /**
   * the next prime less than or equal to the receiver up to 65521.
   * @arguments _none_
   * @example
   *  (25).nextPrime(); // => 27
   */
  sc.define("nextPrime", {
    Number: function() {
      var i, p, lo = 0, hi = primelist.length;
      var num = this|0;
      while (hi >= lo) {
        i = (lo + hi) >> 1;
        p = primelist[i];
        if (num === p) { return primelist[i]; }
        if (num < p) {
          hi = i - 1;
        } else {
          lo = i + 1;
        }
      }
      return primelist[Math.max(0, Math.min(lo, primelist.length-1))];
    },
    Array: function() {
      return this.map(function(x) { return x.nextPrime(); });
    }
  });

  /**
   * whether the receiver is prime.
   * @arguments _none_
   * @example
   *  (13).isPrime(); // => true
   */
  sc.define("isPrime", {
    Number: function() {
      return primelist.indexOf(this|0) !== -1;
    },
    Array: function() {
      return this.map(function(x) { return x.isPrime(); });
    }
  });

  /**
   * the index of a prime number less than or equal to the receiver up to 65521. If the receiver is not a prime, the answer is -1.
   * @arguments _none_
   */
  sc.define("indexOfPrime", {
    Number: function() {
      return primelist.indexOf(this|0);
    },
    Array: function() {
      return this.map(function(x) { return x.indexOfPrime(); });
    }
  });

  /**
   * the prime factors as array.
   * @arguments _none_
   * @example
   *  (2000).factors(); // => [ 2, 2, 2, 2, 5, 5, 5 ]
   */
  sc.define("factors", {
    Number: function() {
      if (this <= 1) { return []; }
      var a = [];
      var num = this|0, prime;
      for (var i = 0, imax = primelist.length; i < imax; ++i) {
        prime = primelist[i];
        while (num % prime === 0) {
          a.push(prime);
          num /= prime;
          if (num === 1) { return a; }
        }
        if (Math.sqrt(prime) > num) {
          a.push(num);
          return a;
        }
      }
      a.push(num);
      return a;
    },
    Array: function() {
      return this.map(function(x) { return x.factors(); });
    }
  });

})(sc);

sc.define("product", {
  Array: function(func) {
    var product = 1, i, imax;
    if (func) {
      func = sc.func(func);
      for (i = 0, imax = this.length; i < imax; ++i) {
        product = product.opMul(func(this[i], i));
      }
    } else {
      // optimized version if no function
      for (i = 0, imax = this.length; i < imax; ++i) {
        product = product.opMul(this[i]);
      }
    }
    return product;
  }
});

/**
 * Put *item* at *index*, replacing what is there.
 * @arguments _(index, item)_
 */
sc.define("put", {
  Array: function(index, item) {
    if (typeof index === "number") {
      if (0 <= index && index < this.length) {
        this[index|0] = item;
      }
    } else if (Array.isArray(index)) {
      index.forEach(function(index) {
        this.put(index, item);
      }, this);
    }
    return this;
  }
});

/**
 * Put the *values* in the corresponding indices given by *keys*. If one of the two argument arrays is longer then it will wrap.
 * @arguments _(keys, values)_
 */
sc.define("putEach", {
  Array: function(keys, values) {
    keys = keys.asArray();
    values = values.asArray();
    keys.map(function(key, i) {
      this[key] = values.wrapAt(i);
    }, this);
    return this;
  }
});

/**
 * Place *item* at the first index in the collection. Note that if the collection is empty (and therefore has no indexed slots) the item will not be added.
 * @arguments _(item)_
 * @example
 *  [3, 4, 5].putFirst(100); // => [ 100, 4, 5 ]
 *  [].putFirst(100); // => []
 */
sc.define("putFirst", {
  Array: function(item) {
    if (this.length > 0) { this[0] = item; }
    return this;
  }
});

/**
 * Place *item* at the last index in the collection. Note that if the collection is empty (and therefore has no indexed slots) the item will not be added.
 * @arguments _(item)_
 * @example
 *  [3, 4, 5].putLast(100); // => [ 3, 4, 100 ]
 *  [].putLast(100); // => []
 */
sc.define("putLast", {
  Array: function(item) {
    if (this.length > 0) { this[this.length-1] = item; }
    return this;
  }
});

/**
 * Return a new Array whose elements have been reordered via one of 10 "counting" algorithms.
 * @arguments _(patternType)_
 * @example
 *  [1, 2, 3, 4].pyramid(0);
 *  // => [ 1, 1, 2, 1, 2, 3, 1, 2, 3, 4 ]
 */
sc.define("pyramid", {
  Array: function(patternType) {
    patternType = patternType === void 0 ? 1 : patternType;
    var obj1, obj2, i, j, k, n, m, numslots, x;
    obj1 = this;
    obj2 = [];
    m = Math.max(1, Math.min(patternType, 10))|0;
    x = numslots = this.length;
    switch (patternType) {
    case 1:
      n = n = (x * x + x) >> 1;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = 0; j <= i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 2:
      n = (x * x + x) >> 1;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 3:
      n = (x * x + x) >> 1;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = 0; j <= numslots - 1 - i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 4:
      n = (x * x + x) >> 1;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = i; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 5:
      n = x * x;
      for (i = k = 0; i < numslots; ++i) {
        for (j = 0; j <= i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      for (i = 0; i < numslots - 1; ++i) {
        for (j = 0; j <= numslots - 2 - i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 6:
      n = x * x;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      for (i = 0; i < numslots - 1; ++i) {
        for (j = i + 1; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 7:
      n = x * x + x - 1;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = 0; j <= numslots - 1 - i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      for (i = 1; i < numslots; ++i) {
        for (j = 0; j <= i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 8:
      n = x * x + x - 1;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = i; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      for (i = 1; i < numslots; ++i) {
        for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 9:
      n = x * x;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = 0; j <= i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      for (i = 0; i < numslots - 1; ++i) {
        for (j = i + 1; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 10:
      n = x * x;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      for (i = 0; i < numslots - 1; ++i) {
        for (j = 0; j <= numslots - 2 - i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    }
    return obj2;
  }
});

/**
 * Like `pyramid`, but keep the resulting values grouped in subarrays.
 * @arguments _(patternType)_
 * @example
 *  [1, 2, 3, 4].pyramidg(0);
 *  => [ [ 1 ], [ 1, 2 ], [ 1, 2, 3 ], [ 1, 2, 3, 4 ] ]
 */
sc.define("pyramidg", {
  Array: function(patternType) {
    var list = [], lastIndex, i;
    patternType = patternType === void 0 ? 1 : patternType;
    patternType = Math.max(1, Math.min(patternType, 10))|0;
    lastIndex = this.length - 1;
    switch (patternType) {
    case 1:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(0, i+1));
      }
      break;
    case 2:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(lastIndex-i, lastIndex+1));
      }
      break;
    case 3:
      for (i = lastIndex; i >= 0; --i) {
        list.push(this.slice(0, i+1));
      }
      break;
    case 4:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(i, lastIndex+1));
      }
      break;
    case 5:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(0, i+1));
      }
      for (i = lastIndex-1; i >= 0; --i) {
        list.push(this.slice(0, i+1));
      }
      break;
    case 6:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(lastIndex-i, lastIndex+1));
      }
      for (i = lastIndex-1; i >= 0; --i) {
        list.push(this.slice(lastIndex-i, lastIndex+1));
      }
      break;
    case 7:
      for (i = lastIndex; i >= 0; --i) {
        list.push(this.slice(0, i+1));
      }
      for (i = 1; i <= lastIndex; ++i) {
        list.push(this.slice(0, i+1));
      }
      break;
    case 8:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(i, lastIndex+1));
      }
      for (i = lastIndex - 1; i >= 0; --i) {
        list.push(this.slice(i, lastIndex+1));
      }
      break;
    case 9:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(0, i+1));
      }
      for (i = 1; i <= lastIndex; ++i) {
        list.push(this.slice(i, lastIndex+1));
      }
      break;
    case 10:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(lastIndex-i, lastIndex+1));
      }
      for (i = lastIndex-1; i >= 0; --i) {
        list.push(this.slice(0, i+1));
      }
      break;
    }
    return list;
  }
});

/**
 * round the receiver to the quantum.
 * @arguments _([quantum=1, tolerance=0.05, strength=1])_
 * @example
 *  sc.Range("0,0.1..1").quantize(1, 0.3, 0.5)
 *  // => [ 0, 0.05, 0.1, 0.3, 0.4, 0.5, 0.6, 0.7, 0.9, 0.95, 1 ]
 */
sc.define("quantize", {
  Number: function(quantum, tolerance, strength) {
    if (Array.isArray(quantum) || Array.isArray(tolerance) || Array.isArray(strength)) {
      return [this,quantum,tolerance,strength].flop().map(function(items) {
        return items[0].quantize(items[1],items[2],items[3]);
      });
    }
    quantum = typeof quantum === "undefined" ? 1 : quantum;
    tolerance = typeof tolerance === "undefined" ? 0.05 : tolerance;
    strength = typeof strength === "undefined" ? 1 : strength;
    var round = this.round(quantum);
    var diff = round - this;
    if (Math.abs(diff) < tolerance) {
      return this + (strength * diff);
    }
    return this;
  },
  Array: function(quantum, tolerance, strength) {
    return this.map(function(x) { return x.quantize(quantum, tolerance, strength); });
  }
});

/**
 * converts radian to degree
 * @arguments _none_
 */
sc.define("raddeg", {
  Number: function() {
    return this * 180 / Math.PI;
  },
  Array: function() {
    return this.map(function(x) { return x.raddeg(); });
  }
});

/**
 * Map receiver onto a ramp starting at 0.
 * @arguments _none_
 */
sc.define("ramp", {
  Number: function() {
    if (this <= 0) { return 0; }
    if (this >= 1) { return 1; }
    return this;
  },
  Array: function() {
    return this.map(function(x) { return x.ramp(); });
  }
});

/**
 * Fill a Array with random values in the range *minVal* to *maxVal*.
 * @arguments _(size [, minVal=0, maxVal=1])_
 * @example
 *  Array.rand(8, 1, 100);
 */
sc.define("*rand", {
  Array: function(size, minVal, maxVal) {
    minVal = minVal === void 0 ? 0 : minVal;
    maxVal = maxVal === void 0 ? 1 : maxVal;
    var a = new Array(size|0);
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = minVal.rrand(maxVal);
    }
    return a;
  }
});

/**
 * Random number from zero up to the receiver, exclusive.
 * @arguments _none_
 */
sc.define("rand", {
  Number: function() {
    return Math.random() * this;
  },
  Array: function() {
    return this.map(function(x) { return x.rand(); });
  }
});

/**
 * Fill an Array with random values in the range -*val* to +*val*.
 * @arguments _(size [, val=1])_
 * @example
 *  Array.rand2(8, 100);
 */
sc.define("*rand2", {
  Array: function(size, val) {
    val = val === void 0 ? 1 : val;
    var a = new Array(size|0);
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = val.rand2(val);
    }
    return a;
  }
});

/**
 * @returns a random number from -*this* to +*this*.
 */
sc.define("rand2", {
  Number: function() {
    return (Math.random() * 2 - 1) * this;
  },
  Array: function() {
    return this.map(function(x) { return x.rand2(); });
  }
});

/**
 * Convert a ratio to an interval in semitones.
 * @arguments _none_
 * @returns an interval in semitones
 * @example
 *  sc.Range("1, 1.2..2").ratiomidi();
 *  // => [ 0, 3.1564, 5.8251, 8.1368, 10.1759, 11.9999 ]
 */
sc.define("ratiomidi", {
  Number: function() {
    return Math.log(Math.abs(this)) * Math.LOG2E * 12;
  },
  Array: function() {
    return this.map(function(x) { return x.ratiomidi(); });
  }
});

/**
 * 1 / this
 * @arguments _none_
 */
sc.define("reciprocal", {
  Number: function() {
    return 1 / this;
  },
  Array: function() {
    return this.map(function(x) { return x.reciprocal(); });
  }
});

/**
 * a value for a rectangular window function between 0 and 1.
 * @arguments _none_
 */
sc.define("rectWindow", {
  Number: function() {
    if (this < 0 || this > 1) { return 0; }
    return 1;
  },
  Array: function() {
    return this.map(function(x) { return x.rectWindow(); });
  }
});

/**
 * Answer a new collection which consists of all items in the receiver for which *function* answers False. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 */
sc.define("reject", {
  Array: function(func) {
    func = sc.func(func);
    return this.filter(function(x, i) { return !func(x, i); });
  }
});

/**
 * Remove *item* from the receiver.
 * @arguments _(item)_
 */
sc.define("remove", {
  Array: function(item) {
    var index = this.indexOf(item);
    if (index !== -1) {
      return this.splice(index, 1)[0];
    }
    return null;
  }
});

/**
 * Remove all items in array from the receiver.
 * @arguments _(list)_
 */
sc.define("removeAll", {
  Array: function(list) {
    for (var i = 0, imax = list.length; i < imax; ++i) {
      var index = this.indexOf(list[i]);
      if (index !== -1) {
        this.splice(index, 1);
      }
    }
    return this;
  }
});

/**
 * Remove all items in the receiver for which function answers True. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 */
sc.define("removeAllSuchThat", {
  Array: function(func) {
    func = sc.func(func);
    var remIndices = [], results = [], i, imax;
    for (i = 0, imax = this.length; i < imax; ++i) {
      if (func(this[i], i)) {
        remIndices.push(i);
        results.push(this[i]);
      }
    }
    for (i = remIndices.length; i--; ) {
      this.splice(remIndices[i], 1);
    }
    return results;
  }
});

/**
 * Remove and return the element at *index*, shrinking the size of the Array.
 * @arguments _(index)_
 */
sc.define("removeAt", {
  Array: function(index) {
    if (index >= 0) {
      return this.splice(index|0, 1)[0];
    }
  }
});

/**
 * Remove all occurrences of the items in array from the receiver.
 * @arguments _(list)_
 */
sc.define("removeEvery", {
  Array: function(list) {
    var index;
    for (var i = 0, imax = list.length; i < imax; ++i) {
      do {
        index = this.indexOf(list[i]);
        if (index !== -1) {
          this.splice(index, 1);
        }
      } while (index !== -1);
    }
    return this;
  }
});

sc.define("removing", {
  Array: function(item) {
    var a = this.slice();
    a.remove(item);
    return a;
  }
});

/**
 * Return a new array in which a number of elements have been replaced by another.
 * @arguments _(find, replace)_
 */
sc.define("replace", {
  Array: function(find, replace) {
    var index, out = [], array = this;
    find = find.asArray();
    replace = replace.asArray();
    while ((index = array.find(find)) !== -1) {
      out = out.concat(array.keep(index), replace);
      array = array.drop(index + find.length);
    }
    return out.concat(array);
  }
});

/**
 * Returns a new Array of the desired length, with values resampled evenly-spaced from the receiver without interpolation.
 * @arguments _(newSize)_
 * @example
 *  [1, 2, 3, 4].resamp0(12); // => [ 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4 ]
 *  [1, 2, 3, 4].resamp0( 2); // => [ 1, 4 ]
 */
sc.define("resamp0", {
  Array: function(newSize) {
    var factor = (this.length - 1) / (newSize - 1);
    var a = new Array(newSize);
    for (var i = 0; i < newSize; ++i) {
      a[i] = this[Math.round(i * factor)];
    }
    return a;
  }
});

/**
 * Returns a new Array of the desired length, with values resampled evenly-spaced from the receiver with linear interpolation.
 * @arguments _(newSize)_
 * @example
 *  [1, 2, 3, 4].resamp1(12); // => [ 1, 1.2727, 1.5454, ... , 3.7272, 4 ]
 *  [1, 2, 3, 4].resamp1( 3); // => [ 1, 2.5, 4 ]
 */
sc.define("resamp1", {
  Array: function(newSize) {
    var factor = (this.length - 1) / (newSize - 1);
    var a = new Array(newSize);
    for (var i = 0; i < newSize; ++i) {
      a[i] = this.blendAt(i * factor);
    }
    return a;
  }
});

/**
 * Return a new Array whose elements are reversed.
 * @arguments _none_
 */
sc.define(["reverse", "sc_reverse"], {
  Array: function() {
    return this.slice().reverse();
  }
});

/**
 * Iterate over the elements in reverse order, calling the function for each element. The function is passed two arguments, the element and an index.
 * @arguments _(function)_
 */
sc.define("reverseDo", {
  Number: function(func) {
    func = sc.func(func);
    var i = this|0, j = 0;
    while (--i >= 0) {
      func(i, j++);
    }
    return this;
  }
});

/**
 * performs a binary right shift
 * @arguments _(number)_
 */
sc.define(["rightShift", ">>"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.rightShift(num); }, this);
    }
    return this >> num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.rightShift(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.rightShift(num); });
    }
  }
});

/**
 * (a * b) + a
 * @arguments _(number)_
 */
sc.define("ring1", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.ring1(num); }, this);
    }
    return this * num + this;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.ring1(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.ring1(num); });
    }
  }
});

/**
 * ((a*b) + a + b)
 * @arguments _(number)_
 */
sc.define("ring2", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.ring2(num); }, this);
    }
    return this * num + this + num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.ring2(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.ring2(num); });
    }
  }
});

/**
 * (a * a *b)
 * @arguments _(number)_
 */
sc.define("ring3", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.ring3(num); }, this);
    }
    return this * this * +num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.ring3(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.ring3(num); });
    }
  }
});

/**
 * ((a * a * b) - (a * b * b))
 * @arguments _(number)_
 */
sc.define("ring4", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.ring4(num); }, this);
    }
    return this * this * num - this * num * num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.ring4(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.ring4(num); });
    }
  }
});

/**
 * Return a new Array whose elements are in rotated order. The receiver is unchanged.
 * @arguments _(n)_
 * @example
 *  [1, 2, 3, 4].rotate( 1); // => [ 4, 1, 2, 3 ]
 *  [1, 2, 3, 4].rotate(-1); // => [ 2, 3, 4, 1 ]
 */
sc.define("rotate", {
  Array: function(n) {
    n = n === void 0 ? 1 : n|0;
    var a = new Array(this.length);
    var size = a.length;
    n %= size;
    if (n < 0) { n = size + n; }
    for (var i = 0, j = n; i < size; ++i) {
      a[j] = this[i];
      if (++j >= size) { j = 0; }
    }
    return a;
  }
});

/**
 * Round to multiple of aNumber
 * @arguments _(number)_
 */
sc.define("round", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.round(num); }, this);
    }
    return num === 0 ? 0 : Math.round(this / num) * num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.round(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.round(num); });
    }
  }
});

/**
 * round up to a multiply of aNumber
 * @arguments _(number)_
 */
sc.define("roundUp", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.roundUp(num); }, this);
    }
    return num === 0 ? 0 : Math.ceil(this / num) * num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.roundUp(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.roundUp(num); });
    }
  }
});

/**
 * a random number in the interval ]a, b[.
 * @arguments _(number)_
 */
sc.define("rrand", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.rrand(num); }, this);
    }
    return this > num ?
      Math.random() * (num - this) + this :
      Math.random() * (this - num) + num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.rrand(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.rrand(num); });
    }
  }
});

/**
 * a * b when a < 0, otherwise a.
 * @arguments _(number)_
 */
sc.define("scaleneg", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.scaleneg(num); }, this);
    }
    num = 0.5 * num + 0.5;
    return (Math.abs(this) - this) * num + this;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.scaleneg(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.scaleneg(num); });
    }
  }
});

/**
 * Returns a new Array whose elements have been scrambled. The receiver is unchanged.
 * @arguments _none_
 */
sc.define(["scramble", "shuffle"], {
  Array: function() {
    var a = this.slice(0);
    var i, j, t, m, k = a.length;
    for (i = 0, m = k; i < k - 1; i++, m--) {
      j = i + ((Math.random() * m)|0);
      t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }
});

/**
 * Map receiver in the onto an S-curve.
 * @arguments _none_
 */
sc.define("scurve", {
  Number: function() {
    if (this <= 0) { return 0; }
    if (this >= 1) { return 1; }
    return this * this * (3 - 2 * this);
  },
  Array: function() {
    return this.map(function(x) { return x.scurve(); });
  }
});

/**
 * Return the set theoretical intersection of this and *that*.
 * @arguments _(that)_
 * @example
 *  [1, 2, 3].sect([2, 3, 4, 5]); // => [ 2, 3 ]
 */
sc.define("sect", {
  Array: function(that) {
    var result = [], i, imax;
    for (i = 0, imax = this.length; i < imax; ++i) {
      if (that.indexOf(this[i]) !== -1) {
        result.push(this[i]);
      }
    }
    return result;
  }
});

/**
 * Answer a new collection which consists of all items in the receiver for which function answers True. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 */
sc.define("select", {
  Array: function(func) {
    return this.filter(sc.func(func));
  }
});

/**
 * Separates the collection into sub-collections by calling the function for each adjacent pair of elements. If the function returns true, then a separation is made between the elements.
 * @arguments _(function)_
 * @example
 *  sc.Range("0..10").separate("isPrime");
 *  // => [ [0,1,2] , [3], [4,5], [6,7], [8,9,10] ]
 */
sc.define("separate", {
  Array: function(func) {
    var list, sublist;
    func = func === void 0 ? sc.func(true) : sc.func(func);
    list = [];
    sublist = [];
    this.doAdjacentPairs(function(a, b, i) {
      sublist.push(a);
      if (func(a, b, i)) {
        list.push(sublist);
        sublist = [];
      }
    });
    if (this.length > 0) {
      sublist.push(this[this.length-1]);
    }
    list.push(sublist);
    return list;
  }
});

/**
 * Fill an Array with an arithmetic series.
 * @arguments (size [, start=0, step=1])
 * @example
 *  Array.series(5, 10, 2); // => [ 10, 12, 14, 16, 18 ]
 */
sc.define("*series", {
  Array: function(size, start, step) {
    start = start === void 0 ? 0 : start;
    step  = step  === void 0 ? 1 : step;
    var a = new Array(size|0);
    for (var i = 0, imax = a.length; i < imax; i++) {
      a[i] = start + (step * i);
    }
    return a;
  }
});

/**
 * return an artithmetic series from this over second to last.
 * @arguments (second, last)
 * @example
 *  (5).series(7, 10); // => [ 5, 7, 9 ]
 */
sc.define("series", {
  Number: function(second, last) {
    var step = second - this;
    var size = (Math.floor((last - this) / step + 0.001)|0) + 1;
    return Array.series(size, this, step);
  }
});

/**
 * set nth bit to zero (bool = false) or one (bool = true)
 * @arguments _(number, bool)_
 */
sc.define("setBit", {
  Number: function(num, bool) {
    if (Array.isArray(num)) {
      var that = this;
      for (var i = 0, imax = num.length; i < imax; ++i) {
        that = that.setBit(num[i], bool);
      }
      return that;
    }
    bool = bool === void 0 ? true : !!bool;
    if (bool) {
      return this | (1 << num);
    } else {
      return this & ~(1 << num);
    }
  },
  Array: function(num, bool) {
    return this.map(function(x) { return x.setBit(num, bool); });
  }
});

/**
 * Answer -1 if negative, +1 if positive or 0 if zero.
 * @arguments _none_
 */
sc.define("sign", {
  Number: function() {
    return this > 0 ? +1 : this === 0 ? 0 : -1;
  },
  Array: function() {
    return this.map(function(x) { return x.sign(); });
  }
});

/**
 * Sine
 * @arguments _none_
 */
sc.define("sin", {
  Number: function() {
    return Math.sin(this);
  },
  Array: function() {
    return this.map(function(x) { return x.sin(); });
  }
});

/**
 * Hyperbolic sine
 * @arguments _none_
 */
sc.define("sinh", {
  Number: function() {
    return (Math.pow(Math.E, this) - Math.pow(Math.E, -this)) * 0.5;
  },
  Array: function() {
    return this.map(function(x) { return x.sinh(); });
  }
});

/**
 * Return the number of elements the receiver.
 * @arguments _none_
 */
sc.define("size", {
  Number: function() {
    return 0;
  },
  Boolean: function() {
    return 0;
  },
  Array: function() {
    return this.length;
  },
  String: function() {
    return this.length;
  },
  Function: function() {
    return 0;
  }
});

/**
 * Return a new Array whose elements are repeated subsequences from the receiver. Easier to demonstrate than explain.
 * @arguments _([windowLength=3, stepSize=1])_
 * @example
 *  [1, 2, 3, 4, 5, 6].slide(3, 1); // => [ 1, 2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6 ]
 */
sc.define("slide", {
  Array: function(windowLength, stepSize) {
    var obj1, obj2, numslots, numwin, h, i, j, k, m, n;
    windowLength = windowLength === void 0 ? 3 : windowLength;
    stepSize     = stepSize     === void 0 ? 1 : stepSize;
    obj1 = this;
    obj2 = [];
    m = windowLength;
    n = stepSize;
    numwin = ((this.length + n - m) / n)|0;
    numslots = numwin * m;
    for (i=h=k=0; i<numwin; ++i,h+=n) {
      for (j=h; j<m+h; ++j) {
        obj2[k++] = obj1[j];
      }
    }
    return obj2;
  }
});

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

/**
 * Return a new Array of length maxlen with the items partly repeated (random choice of given probability).
 * @arguments _([probability=0.25, maxlen=100])_
 */
sc.define("sputter", {
  Array: function(probability, maxlen) {
    probability = probability === void 0 ? 0.25 : probability;
    maxlen      = maxlen      === void 0 ? 100  : maxlen|0;
    var a = [], i = 0, j = 0, size = this.length;
    while (i < size && j < maxlen) {
      a[j++] = this[i];
      if (probability < Math.random()) { i += 1; }
    }
    return a;
  }
});

/**
 * (a - b) ** 2
 * @arguments _(number)_
 */
sc.define("sqrdif", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.sqrdif(num); }, this);
    }
    var z = this - num;
    return z * z;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.sqrdif(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.sqrdif(num); });
    }
  }
});

/**
 * (a + b) ** 2
 * @arguments _(number)_
 */
sc.define("sqrsum", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.sqrsum(num); }, this);
    }
    var z = this + num;
    return z * z;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.sqrsum(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.sqrsum(num); });
    }
  }
});

/**
 * the square root of the number.
 * @arguments _none_
 */
sc.define("sqrt", {
  Number: function() {
    return Math.sqrt(this);
  },
  Array: function() {
    return this.map(function(x) { return x.sqrt(); });
  }
});

/**
 * the square of the number
 * @arguments _none_
 */
sc.define("squared", {
  Number: function() {
    return this * this;
  },
  Array: function() {
    return this.map(function(x) { return x.squared(); });
  }
});

/**
 * Return a new Array whose elements are repeated n times.
 * @arguments _(n)_
 * @example
 *  [1, 2, 3].stutter(2); // => [ 1, 1, 2, 2, 3, 3 ]
 */
sc.define("stutter", {
  Array: function(n) {
    n = n === void 0 ? 2 : Math.max(0, n|0);
    var a = new Array(this.length * n);
    for (var i = 0, j = 0, imax = this.length; i < imax; ++i) {
      for (var k = 0; k < n; ++k, ++j) {
        a[j] = this[i];
      }
    }
    return a;
  }
});

/**
 * Answer the sum of the results of function evaluated for each item in the receiver. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 * @example
 *  sc.Range("0..10").sum(); // => 55
 */
sc.define("sum", {
  Array: function(func) {
    var sum = 0, i, imax;
    if (func) {
      func = sc.func(func);
      for (i = 0, imax = this.length; i < imax; ++i) {
        sum = sum.opAdd(func(this[i]));
      }
    } else {
      // optimized version if no function
      for (i = 0, imax = this.length; i < imax; ++i) {
        sum = sum.opAdd(this[i]);
      }
    }
    return sum;
  }
});

/**
 * This was suggested by Larry Polansky as a poor man's gaussian.
 * @arguments _none_
 */
sc.define("sum3rand", {
  Number: function() {
    return (Math.random() + Math.random() + Math.random() - 1.5) * 0.666666667 * this;
  },
  Array: function() {
    return this.map(function(x) { return x.sum3rand(); });
  }
});

sc.define("sumabs", {
  Array: function() {
    var sum = 0, elem;
    for (var i = 0, imax = this.length; i < imax; ++i) {
      elem = Array.isArray(this[i]) ? this[i][0] : this[i];
      sum = sum + Math.abs(elem);
    }
    return sum;
  }
});

/**
 * (a * a) + (b * b)
 * @arguments _(number)_
 */
sc.define("sumsqr", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.sumsqr(num); }, this);
    }
    return this * this + num * num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.sumsqr(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.sumsqr(num); });
    }
  }
});

/**
 * Swap two elements in the collection at indices i and j.
 * @arguments _(i, j)_
 * @example
 *  [0,1,2,3,4,5].swap(2, 3); // => [0, 1, 3, 2, 4, 5]
 */
sc.define("swap", {
  Array: function(i, j) {
    if (0 <= i && i < this.length && 0 <= j && j < this.length) {
      var t = this[i|0];
      this[i|0] = this[j|0];
      this[j|0] = t;
    }
    return this;
  }
});

/**
 * Return the set of all items which are not elements of both this and *that*. this -- that
 * @arguments _(that)_
 * @example
 *  [1, 2, 3].symmetricDifference([2, 3, 4, 5]); // => [ 1, 4, 5 ]
 */
sc.define("symmetricDifference", {
  Array: function(that) {
    var result = [], i, imax;
    for (i = 0, imax = this.length; i < imax; ++i) {
      if (that.indexOf(this[i]) === -1) {
        result.push(this[i]);
      }
    }
    for (i = 0, imax = that.length; i < imax; ++i) {
      if (this.indexOf(that[i]) === -1) {
        result.push(that[i]);
      }
    }
    return result;
  }
});

/**
 * Remove and return *item* from collection. The last item in the collection will move to occupy the vacated slot (and the collection size decreases by one).
 * @arguments _(item)_
 * @example
 *  a =  [11, 12, 13, 14, 15];
 *  a.take(12); // => 12
 *  a; => [ 11, 15, 13, 14 ]
 */
sc.define("take", {
  Array: function(item) {
    var index = this.indexOf(item);
    if (index !== -1) {
      return this.takeAt(index);
    }
  }
});

/**
 * Similar to `removeAt`, but does not maintain the order of the items following the one that was removed. Instead, the last item is placed into the position of the removed item and the array's size decreases by one.
 * @arguments _(index)_
 * @example
 *  y = [ 1, 2, 3, 4, 5 ];
 *  y.takeAt(1); // => 2
 *  y; // => [ 1, 5, 3, 4 ]
 */
sc.define("takeAt", {
  Array: function(index) {
    index |= 0;
    if (0 <= index && index < this.length) {
      var retVal = this[index];
      var instead = this.pop();
      if (index !== this.length) {
        this[index] = instead;
      }
      return retVal;
    }
  }
});

/**
 * Removes all items in the receiver for which the *function* answers true. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 * @example
 *  y = [1, 2, 3, 4];
 *  y.takeThese("odd"); // => [ 4, 2 ]
 *  y; // => [ 4, 2 ]
 */
sc.define("takeThese", {
  Array: function(func) {
    func = sc.func(func);
    var i = 0;
    while (i < this.length) {
      if (func(this[i], i)) {
        this.takeAt(i);
      } else {
        ++i;
      }
    }
    return this;
  }
});

/**
 * Tangent
 * @arguments _none_
 */
sc.define("tan", {
  Number: function() {
    return Math.tan(this);
  },
  Array: function() {
    return this.map(function(x) { return x.tan(); });
  }
});

/**
 * Hyperbolic tangent
 * @arguments _none_
 */
sc.define("tanh", {
  Number: function() {
    return this.sinh() / this.cosh();
  },
  Array: function() {
    return this.map(function(x) { return x.tanh(); });
  }
});


sc.define("thresh", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.thresh(num); }, this);
    }
    return this < num ? 0 : this;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.thresh(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.thresh(num); });
    }
  }
});

sc.define("transposeKey", {
  Array: function(amout, octave) {
    octave = octave === void 0 ? 12 : octave;
    return this.opAdd(amout).opMod(octave).sort();
  }
});

/**
 * a value for a triangle window function between 0 and 1.
 * @arguments _none_
 */
sc.define("triWindow", {
  Number: function() {
    if (this < 0 || this > 1) { return 0; }
    return (this < 0.5) ? 2 * this : -2 * this + 2;
  },
  Array: function() {
    return this.map(function(x) { return x.triWindow(); });
  }
});

/**
 * Truncate to multiple of aNumber
 * @arguments _(number)_
 */
sc.define("trunc", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.trunc(num); }, this);
    }
    return num === 0 ? this : Math.floor(this / num) * num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.trunc(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.trunc(num); });
    }
  }
});

sc.define("twice", {
  Number: function() {
    return this * 2;
  },
  Array: function() {
    return this.map(function(x) { return x.twice(); });
  }
});

sc.define("unbubble", {
  Array: function(depth, levels) {
    depth  = depth  === void 0 ? 0 : depth;
    levels = levels === void 0 ? 1 : levels;
    if (depth <= 0) {
      // converts a size 1 array to the item.
      if (this.length > 1) { return this; }
      if (levels <= 1) { return this[0]; }
      return this.unbubble(depth, levels-1);
    }
    return this.map(function(item) {
      return item.unbubble(depth-1);
    });
  }
});

/**
 * Return the set theoretical union of this and *that*.
 * @arguments _(that)_
 * @example
 *  [1, 2, 3].union([2, 3, 4, 5]); // => [ 1, 2, 3, 4, 5 ]
 */
sc.define("union", {
  Array: function(that) {
    var result = this.slice(), i, imax;
    for (i = 0, imax = that.length; i < imax; ++i) {
      if (result.indexOf(that[i]) === -1) {
        result.push(that[i]);
      }
    }
    return result;
  }
});

sc.define("uniq", {
  Array: function() {
    var result = [], i, imax;
    for (i = 0, imax = this.length; i < imax; ++i) {
      if (result.indexOf(this[i]) === -1) {
        result.push(this[i]);
      }
    }
    return result;
  }
});

/**
 * performs an unsigned right shift
 * @arguments _(number)_
 */
sc.define(["unsignedRightShift", ">>>"], {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.unsignedRightShift(num); }, this);
    }
    return this >>> num;
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.unsignedRightShift(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.unsignedRightShift(num); });
    }
  }
});

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

sc.define("valueArray", function() {
  var slice = [].slice;
  return {
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
      if (arguments.length === 0) {
        return this.call(this);
      } else if (arguments.length === 1) {
        if (Array.isArray(arguments[0])) {
          return this.apply(this, arguments[0]);
        } else {
          return this.call(this, arguments[0]);
        }
      } else {
        return slice.call(arguments).flop().map(function(items) {
          return this.valueArray(items);
        }, this);
      }
    }
  };
});

/**
 * Choose an element from the collection at random using a list of probabilities or weights. The weights must sum to 1.0.
 * @arguments _(weights)_
 * @example
 *  [1, 2, 3, 4].wchoose([0.1, 0.2, 0.3, 0.4]);
 */
sc.define("wchoose", {
  Array: function(weights) {
    var sum = 0;
    for (var i = 0, imax = weights.length; i < imax; ++i) {
      sum += weights[i];
      if (sum >= Math.random()) {
        return this[i];
      }
    }
    return this[weights.length - 1];
  }
});

/**
 * a value for a welsh window function between 0 and 1.
 * @arguments _none_
 */
sc.define("welWindow", {
  Number: function() {
    if (this < 0 || this > 1) { return 0; }
    return Math.sin(this * Math.PI);
  },
  Array: function() {
    return this.map(function(x) { return x.welWindow(); });
  }
});

/**
 * Create a new Array whose slots are filled with the given arguments.
 * @arguments _(... args)_
 */
sc.define("*with", {
  Array: function() {
    return Array.apply(null, arguments);
  }
});

/**
 * Wrapping at *lo* and *hi*.
 * @arguments _(lo, hi)_
 */
sc.define("wrap", {
  Number: function(lo, hi) {
    if (Array.isArray(lo) || Array.isArray(hi)) {
      return [this,lo,hi].flop().map(function(items) {
        return items[0].wrap(items[1], items[2]);
      });
    }
    if (lo > hi) {
      return this.wrap(hi, lo);
    }
    var _in = this, range;
    if (_in >= hi) {
      range = hi - lo;
      _in -= range;
      if (_in < hi) { return _in; }
    } else if (_in < lo) {
      range = hi - lo;
      _in += range;
      if (_in >= lo) { return _in; }
    } else { return _in; }

    if (hi === lo) { return lo; }
    return _in - range * Math.floor((_in - lo) / range);
  },
  Array: function(lo, hi) {
    return this.map(function(x) { return x.wrap(lo, hi); });
  }
});

sc.define("wrap2", {
  Number: function(num) {
    if (Array.isArray(num)) {
      return num.map(function(num) { return this.wrap2(num); }, this);
    }
    return this.wrap(-num, +num);
  },
  Array: function(num) {
    if (Array.isArray(num)) {
      return this.map(function(x, i) { return x.wrap2(num.wrapAt(i)); });
    } else {
      return this.map(function(x) { return x.wrap2(num); });
    }
  }
});

/**
 * Same as `at`, but values for index greater than the size of the Array will be wrapped around to 0.
 * @example
 *  [ 1, 2, 3 ].wrapAt(13); // => 2
 *  [ 1, 2, 3 ].wrapAt([ 0, 1, 2, 3 ]); // => [ 1, 2, 3, 1 ]
 */
sc.define(["wrapAt", "@@"], {
  Array: function(index) {
    if (Array.isArray(index)) {
      return index.map(function(index) {
        return this.wrapAt(index);
      }, this);
    }
    return this[(index|0).iwrap(0, this.length-1)];
  }
});

/**
 * Returns a new Array whose elements are repeated sequences of the receiver, up to size length.
 * @arguments _(size)_
 * @example
 *  [ 1, 2, 3 ].wrapExtend(9); // => [ 1, 2, 3, 1, 2, 3, 1, 2, 3 ]
 */
sc.define("wrapExtend", {
  Array: function(size) {
    size = Math.max(0, size|0);
    var a = new Array(size);
    for (var i = 0; i < size; ++i) {
      a[i] = this[i % this.length];
    }
    return a;
  }
});

/**
 * Same as `put`, but values for index greater than the size of the Array will be wrapped around to 0.
 * @arguments _(index, item)_
 */
sc.define("wrapPut", {
  Array: function(index, item) {
    if (typeof index === "number") {
      this[index.iwrap(0, this.length-1)] = item;
    } else if (Array.isArray(index)) {
      index.forEach(function(index) {
        this.wrapPut(index, item);
      }, this);
    }
    return this;
  }
});

/**
 * Same as `swap`, but values for index greater than the size of the Array will be wrapped around to 0.
 * @arguments _(i, j)_
 */
sc.define("wrapSwap", {
  Array: function(i, j) {
    i = (i|0).iwrap(0, this.length-1);
    j = (j|0).iwrap(0, this.length-1);
    var t = this[i];
    this[i] = this[j];
    this[j] = t;
    return this;
  }
});

/**
 * a random value from zero to this, excluding the value exclude.
 * @arguments _(exclude)_
 */
sc.define("xrand", {
  Number: function(exclude) {
    exclude = exclude === void 0 ? 0 : exclude;
    return (exclude + (this - 1).rand() + 1) % this;
  }
});

/**
 * a random value from this.neg to this, excluding the value exclude.
 * @arguments _(exclude)_
 */
sc.define("xrand2", {
  Number: function(exclude) {
    exclude = exclude === void 0 ? 0 : exclude;
    var res = (2 * this).rand() - this;
    return (res === exclude) ? this : res;
  }
});

(function(sc) {
  "use strict";

  /**
   * @name *Tuning
   * @description
   * Represents a musical tuning (e.g. equal temperament, just intonation, etc.). Used in conjunction with `Scale` to generate pitch information.
   * @example
   *  sc.Tuning.et12(); // => equal temperament
   *  sc.TuningInfo.names(); // => list of tuning name
   *  sc.TuningInfo.at("just"); // => Limit Just Intonation
   */
  function Tuning(tuning, octaveRatio, name) {
    if (!(this instanceof Tuning)) {
      return new Tuning(tuning, octaveRatio, name);
    }
    if (!Array.isArray(tuning)) {
      tuning = [0,1,2,3,4,5,6,7,8,9,10,11];
    }
    if (typeof octaveRatio !== "number") {
      octaveRatio = 2;
    }
    if (typeof name !== "string") {
      name = "Unknown Tuning";
    }
    this._tuning      = tuning;
    this._octaveRatio = octaveRatio;
    this.name = name;
  }
  /**
   * @name *choose
   * @description
   * Creates a random tuning from the library, constrained by size (which defaults to 12)
   * @arguments _([size=12])_
   */
  Tuning.choose = function(size) {
    if (Array.isArray(size)) {
      return size.map(function(size) {
        return Tuning.choose(size);
      });
    }
    if (typeof size !== "number") {
      size = 12;
    }
    return TuningInfo.choose(
      function(x) { return x.size() === size; }
    );
  };
  Tuning.et = function(pitchesPerOctave) {
    if (typeof pitchesPerOctave !== "number") {
      pitchesPerOctave = 12;
    }
    return Tuning(Tuning.calcET(pitchesPerOctave),
                  2,
                  Tuning.etName(pitchesPerOctave));
  };
  Tuning["default"] = function(pitchesPerOctave) {
    return Tuning.et(pitchesPerOctave);
  };
  Tuning.calcET = function(pitchesPerOctave) {
    var a = new Array(pitchesPerOctave);
    for (var i = a.length; i--; ) {
      a[i] = i * (12 / pitchesPerOctave);
    }
    return a;
  };
  Tuning.etName = function(pitchesPerOctave) {
    return "ET" + pitchesPerOctave;
  };
  /**
   * @name semitones
   * @description
   * Returns an array of semitone values for the pitch set
   * @arguments _none_
   */
  Tuning.prototype.semitones = function() {
    return this._tuning.slice();
  };
  /**
   * @name cents
   * @description
   * Returns a array of cent values for the pitch set
   * @arguments _none_
   */
  Tuning.prototype.cents = function() {
    return this._tuning.slice().map(function(x) {
      return x * 100;
    });
  };
  /**
   * @name ratios
   * @description
   * Returns a tuned array of ratios for the pitch set
   * @arguments _none_
   */
  Tuning.prototype.ratios = function() {
    return this._tuning.midiratio();
  };
  /**
   * @name at
   * @arguments _(index)_
   */
  Tuning.prototype.at = function(index) {
    return this._tuning.at(index);
  };
  /**
   * @name wrapAt
   * @arguments _(index)_
   */
  Tuning.prototype.wrapAt = function(index) {
    return this._tuning.wrapAt(index);
  };
  /**
   * @name octaveRatio
   * @arguments _none_
   */
  Tuning.prototype.octaveRatio = function() {
    return this._octaveRatio;
  };
  /**
   * @name size
   * @arguments _none_
   */
  Tuning.prototype.size = function() {
    return this._tuning.length;
  };
  /**
   * @name stepsPerOctave
   * @arguments _none_
   */
  Tuning.prototype.stepsPerOctave = function() {
    return Math.log(this._octaveRatio) * Math.LOG2E * 12;
  };
  /**
   * @name tuning
   * @arguments _none_
   */
  Tuning.prototype.tuning = function() {
    return this._tuning;
  };
  /**
   * @name equals
   * @arguments _(that)_
   */
  Tuning.prototype.equals = function(that) {
    return this._octaveRatio === that._octaveRatio &&
      this._tuning.equals(that._tuning);
  };
  // ## deepCopy ()
  Tuning.prototype.deepCopy = function() {
    return Tuning(this._tuning.slice(0),
                  this._octaveRatio,
                  this.name);
  };

  // # TuningInfo
  var TuningInfo = sc.TuningInfo = {};
  var tunings    = {};

  // ## TuningInfo.choose (selectFunc)
  TuningInfo.choose = function(selectFunc) {
    var candidates = [];
    var keys = Object.keys(tunings);
    var t;
    for (var i = keys.length; i--; ) {
      t = tunings[keys[i]];
      if (typeof selectFunc !== "function" || selectFunc(t)) {
        candidates.push(t);
      }
    }
    t = candidates[(Math.random() * candidates.length)|0];
    if (t) {
      return t.deepCopy();
    }
  };
  // ## TuningInfo.at (key)
  TuningInfo.at = function(key) {
    var t = tunings[key];
    if (t) {
      return t.deepCopy();
    }
  };
  // ## TuningInfo.names ()
  TuningInfo.names = function() {
    var keys = Object.keys(tunings);
    keys.sort();
    return keys;
  };
  // ## TuningInfo.register (key, tuning)
  TuningInfo.register = function(key, tuning) {
    if (typeof key === "string" && tuning instanceof Tuning) {
      tunings[key] = tuning;
      Tuning[key] = (function(key) {
        return function() {
          return TuningInfo.at(key).deepCopy();
        };
      }(key));
    }
  };

  TuningInfo.register(
    "et12", Tuning(([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
    ]), 2, "ET12")
  );
  TuningInfo.register(
    "just", Tuning([
      1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8
    ].ratiomidi(), 2, "Limit Just Intonation")
  );
  // ### TWELVE-TONE TUNINGS
  sc.TuningInfo.register(
    "pythagorean",
    Tuning([ 1, 256/243, 9/8, 32/27, 81/64, 4/3, 729/512, 3/2, 128/81, 27/16, 16/9, 243/128 ].ratiomidi(), 2, "Pythagorean")
  );

  sc.TuningInfo.register(
    "sept1",
    Tuning([ 1, 16/15, 9/8, 6/5, 5/4, 4/3, 7/5, 3/2, 8/5, 5/3, 9/5, 15/8 ].ratiomidi(), 2, "Septimal Tritone Just Intonation")
  );

  sc.TuningInfo.register(
    "sept2",
    Tuning([ 1, 16/15, 9/8, 6/5, 5/4, 4/3, 7/5, 3/2, 8/5, 5/3, 7/4, 15/8 ].ratiomidi(), 2, "7-Limit Just Intonation")
  );

  sc.TuningInfo.register(
    "mean4",
    Tuning([ 0, 0.755, 1.93, 3.105, 3.86, 5.035, 5.79, 6.965, 7.72, 8.895, 10.07, 10.82 ], 2, "Meantone, 1/4 Syntonic Comma")
  );

  sc.TuningInfo.register(
    "mean5",
    Tuning([ 0, 0.804, 1.944, 3.084, 3.888, 5.028, 5.832, 6.972, 7.776, 8.916, 10.056, 10.86 ], 2, "Meantone, 1/5 Pythagorean Comma")
  );

  sc.TuningInfo.register(
    "mean6",
    Tuning([ 0, 0.86, 1.96, 3.06, 3.92, 5.02, 5.88, 6.98, 7.84, 8.94, 10.04, 10.9 ], 2, "Meantone, 1/6 Pythagorean Comma")
  );

  sc.TuningInfo.register(
    "kirnberger",
    Tuning([ 1, 256/243, Math.sqrt(5)/2, 32/27, 5/4, 4/3, 45/32, Math.pow(5, 0.25), 128/81, Math.pow(5, 0.75)/2, 16/9, 15/8 ].ratiomidi(), 2, "Kirnberger III")
  );

  sc.TuningInfo.register(
    "werckmeister",
    Tuning([ 0, 0.92, 1.93, 2.94, 3.915, 4.98, 5.9, 6.965, 7.93, 8.895, 9.96, 10.935 ], 2, "Werckmeister III")
  );

  sc.TuningInfo.register(
    "vallotti",
    Tuning([ 0, 0.94135, 1.9609, 2.98045, 3.92180, 5.01955, 5.9218, 6.98045, 7.9609, 8.94135, 10, 10.90225 ], 2, "Vallotti")
  );

  sc.TuningInfo.register(
    "young",
    Tuning([ 0, 0.9, 1.96, 2.94, 3.92, 4.98, 5.88, 6.98, 7.92, 8.94, 9.96, 10.9 ], 2, "Young")
  );

  sc.TuningInfo.register(
    "reinhard",
    Tuning([ 1, 14/13, 13/12, 16/13, 13/10, 18/13, 13/9, 20/13, 13/8, 22/13, 13/7, 208/105 ].ratiomidi(), 2, "Mayumi Reinhard")
  );

  sc.TuningInfo.register(
    "wcHarm",
    Tuning([ 1, 17/16, 9/8, 19/16, 5/4, 21/16, 11/8, 3/2, 13/8, 27/16, 7/4, 15/8 ].ratiomidi(), 2, "Wendy Carlos Harmonic")
  );

  sc.TuningInfo.register(
    "wcSJ",
    Tuning([ 1, 17/16, 9/8, 6/5, 5/4, 4/3, 11/8, 3/2, 13/8, 5/3, 7/4, 15/8 ].ratiomidi(), 2, "Wendy Carlos Super Just")
  );

  // ### MORE THAN TWELVE-TONE ET
  sc.TuningInfo.register(
    "et19",
    Tuning(sc.Range("0..18").opMul(12/19), 2, "ET19")
  );

  sc.TuningInfo.register(
    "et22",
    Tuning(sc.Range("0..21").opMul(12/22), 2, "ET22")
  );

  sc.TuningInfo.register(
    "et24",
    Tuning(sc.Range("0..23").opMul(12/24), 2, "ET24")
  );

  sc.TuningInfo.register(
    "et31",
    Tuning(sc.Range("0..30").opMul(12/31), 2, "ET31")
  );

  sc.TuningInfo.register(
    "et41",
    Tuning(sc.Range("0..40").opMul(12/41), 2, "ET41")
  );
  sc.TuningInfo.register(
    "et53",
    Tuning(sc.Range("0..53").opMul(12/53), 2, "ET53")
  );
  // ### NON-TWELVE-TONE JI
  sc.TuningInfo.register(
    "johnston",
    Tuning([ 1, 25/24, 135/128, 16/15, 10/9, 9/8, 75/64, 6/5, 5/4, 81/64, 32/25, 4/3, 27/20, 45/32, 36/25, 3/2, 25/16, 8/5, 5/3, 27/16, 225/128, 16/9, 9/5, 15/8, 48/25 ].ratiomidi(), 2, "Ben Johnston")
  );
  sc.TuningInfo.register(
    "partch",
    Tuning([ 1, 81/80, 33/32, 21/20, 16/15, 12/11, 11/10, 10/9, 9/8, 8/7, 7/6, 32/27, 6/5, 11/9, 5/4, 14/11, 9/7, 21/16, 4/3, 27/20, 11/8, 7/5, 10/7, 16/11, 40/27, 3/2, 32/21, 14/9, 11/7, 8/5, 18/11, 5/3, 27/16, 12/7, 7/4, 16/9, 9/5, 20/11, 11/6, 15/8, 40/21, 64/33, 160/81 ].ratiomidi(), 2, "Harry Partch")
  );
  sc.TuningInfo.register(
    "catler",
    Tuning([ 1, 33/32, 16/15, 9/8, 8/7, 7/6, 6/5, 128/105, 16/13, 5/4, 21/16, 4/3, 11/8, 45/32, 16/11, 3/2, 8/5, 13/8, 5/3, 27/16, 7/4, 16/9, 24/13, 15/8 ].ratiomidi(), 2, "Jon Catler")
  );
  sc.TuningInfo.register(
    "chalmers",
    Tuning([ 1, 21/20, 16/15, 9/8, 7/6, 6/5, 5/4, 21/16, 4/3, 7/5, 35/24, 3/2, 63/40, 8/5, 5/3, 7/4, 9/5, 28/15, 63/32 ].ratiomidi(), 2, "John Chalmers")
  );
  sc.TuningInfo.register(
    "harrison",
    Tuning([ 1, 16/15, 10/9, 8/7, 7/6, 6/5, 5/4, 4/3, 17/12, 3/2, 8/5, 5/3, 12/7, 7/4, 9/5, 15/8 ].ratiomidi(), 2, "Lou Harrison")
  );
  sc.TuningInfo.register(
    "sruti",
    Tuning([ 1, 256/243, 16/15, 10/9, 9/8, 32/27, 6/5, 5/4, 81/64, 4/3, 27/20, 45/32, 729/512, 3/2, 128/81, 8/5, 5/3, 27/16, 16/9, 9/5, 15/8, 243/128 ].ratiomidi(), 2, "Sruti")
  );
  // ### HARMONIC SERIES -- length arbitary
  sc.TuningInfo.register(
    "harmonic",
    Tuning(sc.Range("1..24").ratiomidi(), 2, "Harmonic Series 24")
  );
  // ### STRETCHED/SHRUNK OCTAVE
  // ### Bohlen-Pierce
  sc.TuningInfo.register(
    "bp",
    Tuning(sc.Range("0..12").opMul((3).ratiomidi() / 13), 3.0, "Bohlen-Pierce")
  );
  sc.TuningInfo.register(
    "wcAlpha",
    Tuning(sc.Range("0..14").opMul(0.78), (15 * 0.78).midiratio(), "Wendy Carlos Alpha")
  );
  sc.TuningInfo.register(
    "wcBeta",
    Tuning(sc.Range("0..18").opMul(0.638), (19 * 0.638).midiratio(), "Wendy Carlos Beta")
  );
  sc.TuningInfo.register(
    "wcGamma",
    Tuning(sc.Range("0..33").opMul(0.351), (34 * 0.351).midiratio(), "Wendy Carlos Gamma")
  );

  sc.Tuning = Tuning;

})(sc);

(function(sc) {
  "use strict";

  /**
   * @name *Scale
   * @description
   * Scale supports arbitrary octave divisions and ratios, and (in conjunction with Tuning) can generate pitch information in various ways.
   * @example
   *  sc.Scale.major(); // => Major Scale
   *  sc.Scale.dorian("Pythagorean"); // => Dorian Scale with Pythagorean Tuning
   *  sc.ScaleInfo.names(); // list of scale name
   *  sc.ScaleInfo.at("minor"); // => Minor Scale
   */
  function Scale(degrees, pitchesPerOctave, tuning, name) {
    if (!(this instanceof Scale)) {
      return new Scale(degrees, pitchesPerOctave, tuning, name);
    }
    if (!Array.isArray(degrees)) {
      degrees = [0,2,4,5,7,9,11]; // ionian
    }
    if (typeof pitchesPerOctave !== "number") {
      pitchesPerOctave = Scale.guessPPO(degrees);
    }
    var _name;
    if (typeof tuning === "string") {
      _name = tuning;
      tuning = sc.TuningInfo.at(tuning);
    }
    if (!(tuning instanceof sc.Tuning)) {
      tuning = sc.Tuning["default"](pitchesPerOctave);
    }
    if (name === undefined) {
      name = _name;
    }
    if (typeof name !== "string") {
      name = "Unknown Scale";
    }
    this.name = name;
    this._degrees = degrees;
    this._pitchesPerOctave = pitchesPerOctave;
    this.tuning(tuning);
  }
  /**
   * @name *choose
   * @description
   * Creates a random scale from the library, constrained by size and pitchesPerOctave if desired
   * @arguments _([size=7, pitchesPerOctave=12])_
   * @example
   *  sc.Scale.choose(7);
   */
  Scale.choose = function(size, pitchesPerOctave) {
    if (sc.isArrayArgs(arguments)) {
      return [size, pitchesPerOctave].flop().map(function(items) {
        return Scale.choose(items[0], items[1]);
      });
    }
    if (typeof size !== "number") { size = 7; }
    if (typeof pitchesPerOctave !== "number") { pitchesPerOctave = 12; }
    return ScaleInfo.choose(function(x) {
      return x._degrees.length === size &&
        x._pitchesPerOctave === pitchesPerOctave;
    });
  };
  Scale.guessPPO = function(degrees) {
    if (!Array.isArray(degrees)) {
      return 128;
    }
    var i, max = degrees[0] || 0;
    for (i = degrees.length; i--; ) {
      if (degrees[i] > max) {
        max = degrees[i];
      }
    }
    var etTypes = [53,24,19,12];
    for (i = etTypes.length; i--; ) {
      if (max < etTypes[i]) {
        return etTypes[i];
      }
    }
    return 128;
  };
  /**
   * @name tuning
   * @description
   * Sets or gets the tuning of the Scale.
   * @arguments _([inTuning])_
   * @example
   *  sc.Scale.major().tuning("just"); // set tuning
   *  sc.Scale.major().tuning(); // get tuning
   */
  Scale.prototype.tuning = function(inTuning) {
    if (inTuning === undefined) {
      return this._tuning;
    }
    if (typeof inTuning === "string") {
      inTuning = sc.TuningInfo.at(inTuning);
    }
    if (!(inTuning instanceof sc.Tuning) ) {
      console.warn("The first argument must be instance of Tuning");
      return;
    }
    if (this._pitchesPerOctave !== inTuning.size()) {
      console.warn("Scale steps per octave " + this._pitchesPerOctave + " does not match tuning size ");
      return;
    }
    this._tuning = inTuning;
    this._ratios = this.semitones().midiratio();
    return inTuning;
  };
  /**
   * @name semitone
   * @description
   * Returns a tuned array of semitone values
   * @arguments _none_
   */
  Scale.prototype.semitones = function() {
    return this._degrees.map(this._tuning.wrapAt.bind(this._tuning));
  };
  /**
   * @name cents
   * @description
   * Returns a turned array of cent values
   * @arguments _none_
   */
  Scale.prototype.cents = function() {
    return this.semitones().map(function(x) {
      return x * 100;
    });
  };
  /**
   * @name ratios
   * @description
   * Return a turned array of ratios
   * @arguments _none_
   */
  Scale.prototype.ratios = function() {
    return this._ratios;
  };
  /**
   * @name size
   * @description
   * Returns the length of the scale.
   * @arguments _none_
   * @example
   *  sc.Scale.ionian().size(); // 7
   *  sc.Scale.minorPentatonic().size(); // 5
   */
  Scale.prototype.size = function() {
    return this._degrees.length;
  };
  /**
   * @name pitchesPerOctave
   * @description
   * Returns the size of the pitch class set from which the tuning is drawn
   * @arguments _none_
   * @example
   *  sc.Scale.aeolian().pitchesPerOctave(); // 12
   *  sc.Scale.ajam().pitchesPerOctave(); // 24 (this is a quarter-tone scale)
   */
  Scale.prototype.pitchesPerOctave = function() {
    return this._pitchesPerOctave;
  };
  /**
   * @name stepsPerOctave
   * @description
   * Usually 12, but may be different if the current tuning has a stretched or compressed octave. Needed for degreeToKey
   * @arguments _none_
   */
  Scale.prototype.stepsPerOctave = function() {
    return Math.log(this.octaveRatio()) * Math.LOG2E * 12;
  };
  /**
   * @name at
   * @arguments _(index)_
   */
  Scale.prototype.at = function(index) {
    return this._tuning.at(this._degrees.wrapAt(index));
  };
  /**
   * @name wrapAt
   * @description
   * These access the array generated by semitones.
   * @arguments _(index)_
   * @example
   *  a = sc.Scale.major();
   *  a.wrapAt(4); // =>  7
   *  a.wrapAt([5, 6, 7]); // => [ 9, 11, 0 ]
   */
  Scale.prototype.wrapAt = function(index) {
    return this._tuning.wrapAt(this._degrees.wrapAt(index));
  };
  /**
   * @name degreeToFreq
   * @description
   * Returns a frequency based on current tuning and rootFreq argument.
   * @argument _(degree, rootFreq, octave)_
   * @example
   *  sc.Scale.major().degreeToFreq(2, (60).midicps(), 1); // => 659.25511...
   *  sc.Scale.major("just").degreeToFreq(2, (60).midicps(), 1); // => 654.06391...
   */
  Scale.prototype.degreeToFreq = function(degree, rootFreq, octave) {
    return this.degreeToRatio(degree, octave).opMul(rootFreq);
  };
  /**
   * @name degreeToRatio
   * @description
   * Returns a ratio based on current tuning.
   * @arguments _(degree [, octave=0])_
   * @example
   *  sc.Scale.major().degreeToRatio(2, 1).round(0.001); // => 2.52
   *  sc.Scale.major("just").degreeToRatio(2, 1).round(0.001); // => 2.5
   */
  Scale.prototype.degreeToRatio = function(degree, octave) {
    if (sc.isArrayArgs(arguments)) {
      return [degree, octave].flop().map(function(items) {
        return this.degreeToRatio(items[0], items[1]);
      }, this);
    }
    octave = octave === void 0 ? 0 : octave;
    octave += (degree / this._degrees.length)|0;
    return this.ratios().wrapAt(degree).opMul(this.octaveRatio().pow(octave));
  };
  /**
   * @name degreeToFreq2
   * @description
   * Same `degreeToFreq`, but use `blendAt`.
   * @argument _(degree, rootFreq, octave)_
   * @example
   *  sc.Scale.major().degreeToFreq2(2.5, (60).midicps(), 1); // => 678.8557...
   *  sc.Scale.major("just").degreeToFreq2(2.5, (60).midicps(), 1); // => 675.8660...
   */
  Scale.prototype.degreeToFreq2 = function(degree, rootFreq, octave) {
    return this.degreeToRatio2(degree, octave).opMul(rootFreq);
  };
  /**
   * @name degreeToRatio2
   * @description
   * Same as `degreeToRatio`, but use `blendAt`.
   * @arguments _(degree [, octave=0])_
   * @example
   *  sc.Scale.major().degreeToRatio2(2.5, 1).round(0.001); // => 2.595
   *  sc.Scale.major("just").degreeToRatio2(2.5, 1).round(0.001); // => 2.583
   */
  Scale.prototype.degreeToRatio2 = function(degree, octave) {
    if (sc.isArrayArgs(arguments)) {
      return [degree, octave].flop().map(function(items) {
        return this.degreeToRatio2(items[0], items[1]);
      }, this);
    }
    octave = octave === void 0 ? 0 : octave;
    octave += (degree / this._degrees.length)|0;
    var _index = degree.opMod(this._degrees.length);
    return this.ratios().blendAt(_index).opMul(this.octaveRatio().pow(octave));
  };
  Scale.prototype.checkTuningForMismatch = function(aTuning) {
    return this._pitchesPerOctave === aTuning.size();
  };
  /**
   * @name degrees
   * @arguments _none_
   */
  Scale.prototype.degrees = function() {
    return this._degrees;
  };
  Scale.prototype.guessPPO = function() {
    return Scale.guessPPO(this._degrees);
  };
  /**
   * @name octaveRatio
   * @arguments _none_
   */
  Scale.prototype.octaveRatio = function() {
    return this._tuning.octaveRatio();
  };
  /**
   * @name performDegreeToKey
   * @arguments _(scaleDegree, stepsPerOctave [, accidental=0])_
   */
  Scale.prototype.performDegreeToKey = function(scaleDegree, stepsPerOctave, accidental) {
    if (sc.isArrayArgs(arguments)) {
      return [scaleDegree, stepsPerOctave, accidental].flop().map(function(items) {
        return this.performDegreeToKey(items[0], items[1], items[2]);
      }, this);
    }
    if (typeof stepsPerOctave !== "number") { stepsPerOctave = this.stepsPerOctave(); }
    if (typeof accidental     !== "number") { accidental     = 0; }
    var basekey = this.wrapAt(scaleDegree);
    basekey += stepsPerOctave * ((scaleDegree / this.size())|0);
    if (accidental === 0) {
      return basekey;
    } else {
      return basekey + (accidental * (stepsPerOctave / 12));
    }
  };
  /**
   * @name performKeyToDegree
   * @arguments _(degree [, stepsPerOctave=12])_
   */
  Scale.prototype.performKeyToDegree = function(degree, stepsPerOctave) {
    if (sc.isArrayArgs(arguments)) {
      return [degree, stepsPerOctave].flop().map(function(items) {
        return this.performKeyToDegree(items[0], items[1]);
      }, this);
    }
    if (typeof stepsPerOctave !== "number") { stepsPerOctave = 12; }
    return this._degrees.performKeyToDegree(degree, stepsPerOctave);
  };
  /**
   * @name performNearestInList
   * @arguments _(degree)_
   */
  Scale.prototype.performNearestInList = function(degree) {
    return this._degrees.performNearestInList(degree);
  };
  /**
   * @name performNearestInScale
   * @arguments _(degree [, stepsPerOctave=12])_
   */
  Scale.prototype.performNearestInScale = function(degree, stepsPerOctave) {
    if (sc.isArrayArgs(arguments)) {
      return [degree, stepsPerOctave].flop().map(function(items) {
        return this.performNearestInScale(items[0], items[1]);
      }, this);
    }
    if (typeof stepsPerOctave !== "number") { stepsPerOctave = 12; }
    return this._degrees.performNearestInScale(degree, stepsPerOctave);
  };
  Scale.prototype.equals = function(argScale) {
    return this.degrees().equals(argScale.degrees()) && this._tuning.equals(argScale._tuning);
  };
  Scale.prototype.deepCopy = function() {
    return Scale(this._degrees.slice(),
                 this._pitchesPerOctave,
                 this._tuning.deepCopy(),
                 this.name);
  };

  // # ScaleInfo
  var ScaleInfo = sc.ScaleInfo = {};
  var scales    = {};

  // ## ScaleInfo.choose (selectFunc)
  ScaleInfo.choose = function(selectFunc) {
    var candidates = [];
    var keys = Object.keys(scales);
    var s;
    for (var i = keys.length; i--; ) {
      s = scales[keys[i]];
      if (typeof selectFunc !== "function" || selectFunc(s)) {
        candidates.push(s);
      }
    }
    s = candidates[(Math.random() * candidates.length)|0];
    if (s) {
      return s.deepCopy();
    }
  };
  // ## ScaleInfo.at (key)
  ScaleInfo.at = function(key) {
    var s = scales[key];
    if (s) { return s.deepCopy(); }
  };
  // ## ScaleInfo.names ()
  ScaleInfo.names = function() {
    var keys = Object.keys(scales);
    keys.sort();
    return keys;
  };
  // ## ScaleInfo.register (key, scale)
  ScaleInfo.register = function(key, scale) {
    if (typeof key === "string" && scale instanceof Scale) {
      scales[key] = scale;
      Scale[key] = (function(key) {
        return function(tuning) {
          var scale = scales[key].deepCopy();
          if (typeof tuning === "string") {
            tuning = sc.TuningInfo.at(tuning);
          }
          if (tuning instanceof sc.Tuning) {
            scale.tuning(tuning);
          }
          return scale;
        };
      }(key));
    }
  };

  ScaleInfo.register(
    "major", Scale([0,2,4,5,7,9,11], 12, null, "Major")
  );
  ScaleInfo.register(
    "minor", Scale([0,2,3,5,7,8,10], 12, null, "Natural Minor")
  );
  // ### TWELVE-TONES PER OCTAVE

  // ### 5 note scales
  sc.ScaleInfo.register(
    "minorPentatonic",
    Scale([0,3,5,7,10], 12, "Minor Pentatonic")
  );
  sc.ScaleInfo.register(
    "majorPentatonic",
    Scale([0,2,4,7,9], 12, "Major Pentatonic")
  );
  // ### another mode of major pentatonic
  sc.ScaleInfo.register(
    "ritusen",
    Scale([0,2,5,7,9], 12, "Ritusen")
  );
  // ### another mode of major pentatonic
  sc.ScaleInfo.register(
    "egyptian",
    Scale([0,2,5,7,10], 12, "Egyptian")
  );
  sc.ScaleInfo.register(
	"kumoi",
    Scale([0,2,3,7,9], 12, "Kumoi")
  );
  sc.ScaleInfo.register(
	"hirajoshi",
    Scale([0,2,3,7,8], 12, "Hirajoshi")
  );
  sc.ScaleInfo.register(
	"iwato",
    Scale([0,1,5,6,10], 12, "Iwato")
  );
  sc.ScaleInfo.register(
	"ryukyu",
    Scale([0,4,5,7,11], 12, "Ryukyu")
  );
  sc.ScaleInfo.register(
	"chinese",
    Scale([0,4,6,7,11], 12, "Chinese")
  );
  sc.ScaleInfo.register(
	"indian",
    Scale([0,4,5,7,10], 12, "Indian")
  );
  sc.ScaleInfo.register(
	"pelog",
    Scale([0,1,3,7,8], 12, "Pelog")
  );
  sc.ScaleInfo.register(
	"prometheus",
    Scale([0,2,4,6,11], 12, "Prometheus")
  );
  sc.ScaleInfo.register(
	"scriabin",
    Scale([0,1,4,7,9], 12, "Scriabin")
  );
  // ### han chinese pentatonic scales
  sc.ScaleInfo.register(
	"gong",
    Scale([0,2,4,7,9], 12, "Gong")
  );
  sc.ScaleInfo.register(
	"shang",
    Scale([0,2,5,7,10], 12, "Shang")
  );
  sc.ScaleInfo.register(
    "jiao",
    Scale([0,3,5,8,10], 12, "Jiao")
  );
  sc.ScaleInfo.register(
    "zhi",
    Scale([0,2,5,7,9], 12, "Zhi")
  );
  sc.ScaleInfo.register(
    "yu",
    Scale([0,3,5,7,10], 12, "Yu")
  );
  // ### 6 note scales
  sc.ScaleInfo.register(
    "whole",
    Scale([0,2,4,6,8,10], 12, "Whole Tone")
  );
  sc.ScaleInfo.register(
	"augmented",
    Scale([0,3,4,7,8,11], 12, "Augmented")
  );
  sc.ScaleInfo.register(
	"augmented2",
    Scale([0,1,4,5,8,9], 12, "Augmented 2")
  );
  // ### Partch's Otonalities and Utonalities
  sc.ScaleInfo.register(
    "partch_o1",
    Scale([0,8,14,20,25,34], 43, "partch", "Partch Otonality 1")
  );
  sc.ScaleInfo.register(
	"partch_o2",
    Scale([0,7,13,18,27,35], 43, "partch", "Partch Otonality 2")
  );
  sc.ScaleInfo.register(
    "partch_o3",
    Scale([0,6,12,21,29,36], 43, "partch", "Partch Otonality 3")
  );
  sc.ScaleInfo.register(
    "partch_o4",
    Scale([0,5,15,23,30,37], 43, "partch", "Partch Otonality 4")
  );
  sc.ScaleInfo.register(
    "partch_o5",
    Scale([0,10,18,25,31,38], 43, "partch", "Partch Otonality 5")
  );
  sc.ScaleInfo.register(
    "partch_o6",
    Scale([0,9,16,22,28,33], 43, "partch", "Partch Otonality 6")
  );
  sc.ScaleInfo.register(
    "partch_u1",
    Scale([0,9,18,23,29,35], 43, "partch", "Partch Utonality 1")
  );
  sc.ScaleInfo.register(
    "partch_u2",
    Scale([0,8,16,25,30,36], 43, "partch", "Partch Utonality 2")
  );
  sc.ScaleInfo.register(
    "partch_u3",
    Scale([0,7,14,22,31,37], 43, "partch", "Partch Utonality 3")
  );
  sc.ScaleInfo.register(
    "partch_u4",
    Scale([0,6,13,20,28,38], 43, "partch", "Partch Utonality 4")
  );
  sc.ScaleInfo.register(
    "partch_u5",
    Scale([0,5,12,18,25,33], 43, "partch", "Partch Utonality 5")
  );
  sc.ScaleInfo.register(
    "partch_u6",
    Scale([0,10,15,21,27,34], 43, "partch", "Partch Utonality 6")
  );
  // ### hexatonic modes with no tritone
  sc.ScaleInfo.register(
	"hexMajor7",
    Scale([0,2,4,7,9,11], 12, "Hex Major 7")
  );
  sc.ScaleInfo.register(
    "hexDorian",
    Scale([0,2,3,5,7,10], 12, "Hex Dorian")
  );
  sc.ScaleInfo.register(
    "hexPhrygian",
    Scale([0,1,3,5,8,10], 12, "Hex Phrygian")
  );
  sc.ScaleInfo.register(
    "hexSus",
    Scale([0,2,5,7,9,10], 12, "Hex Sus")
  );
  sc.ScaleInfo.register(
    "hexMajor6",
    Scale([0,2,4,5,7,9], 12, "Hex Major 6")
  );
  sc.ScaleInfo.register(
    "hexAeolian",
    Scale([0,3,5,7,8,10], 12, "Hex Aeolian")
  );
  // ### 7 note scales
  sc.ScaleInfo.register(
	"ionian",
    Scale([0,2,4,5,7,9,11], 12, "Ionian")
  );
  sc.ScaleInfo.register(
	"dorian",
    Scale([0,2,3,5,7,9,10], 12, "Dorian")
  );
  sc.ScaleInfo.register(
	"phrygian",
    Scale([0,1,3,5,7,8,10], 12, "Phrygian")
  );
  sc.ScaleInfo.register(
	"lydian",
    Scale([0,2,4,6,7,9,11], 12, "Lydian")
  );
  sc.ScaleInfo.register(
	"mixolydian",
    Scale([0,2,4,5,7,9,10], 12, "Mixolydian")
  );
  sc.ScaleInfo.register(
	"aeolian",
    Scale([0,2,3,5,7,8,10], 12, "Aeolian")
  );
  sc.ScaleInfo.register(
    "locrian",
    Scale([0,1,3,5,6,8,10], 12, "Locrian")
  );
  sc.ScaleInfo.register(
	"harmonicMinor",
    Scale([0,2,3,5,7,8,11], 12, "Harmonic Minor")
  );
  sc.ScaleInfo.register(
	"harmonicMajor",
    Scale([0,2,4,5,7,8,11], 12, "Harmonic Major")
  );
  sc.ScaleInfo.register(
	"melodicMinor",
    Scale([0,2,3,5,7,9,11], 12, "Melodic Minor")
  );
  sc.ScaleInfo.register(
    "melodicMinorDesc",
    Scale([0,2,3,5,7,8,10], 12, "Melodic Minor Descending")
  );
  sc.ScaleInfo.register(
    "melodicMajor",
    Scale([0,2,4,5,7,8,10], 12, "Melodic Major")
  );
  sc.ScaleInfo.register(
	"bartok",
    Scale([0,2,4,5,7,8,10], 12, "Bartok")
  );
  sc.ScaleInfo.register(
	"hindu",
    Scale([0,2,4,5,7,8,10], 12, "Hindu")
  );
  // ### raga modes
  sc.ScaleInfo.register(
    "todi",
    Scale([0,1,3,6,7,8,11], 12, "Todi")
  );
  sc.ScaleInfo.register(
    "purvi",
    Scale([0,1,4,6,7,8,11], 12, "Purvi")
  );
  sc.ScaleInfo.register(
    "marva",
    Scale([0,1,4,6,7,9,11], 12, "Marva")
  );
  sc.ScaleInfo.register(
    "bhairav",
    Scale([0,1,4,5,7,8,11], 12, "Bhairav")
  );
  sc.ScaleInfo.register(
    "ahirbhairav",
    Scale([0,1,4,5,7,9,10], 12, "Ahirbhairav")
  );
  sc.ScaleInfo.register(
	"superLocrian",
    Scale([0,1,3,4,6,8,10], 12, "Super Locrian")
  );
  sc.ScaleInfo.register(
    "romanianMinor",
    Scale([0,2,3,6,7,9,10], 12, "Romanian Minor")
  );
  sc.ScaleInfo.register(
    "hungarianMinor",
    Scale([0,2,3,6,7,8,11], 12, "Hungarian Minor")
  );
  sc.ScaleInfo.register(
    "neapolitanMinor",
    Scale([0,1,3,5,7,8,11], 12, "Neapolitan Minor")
  );
  sc.ScaleInfo.register(
    "enigmatic",
    Scale([0,1,4,6,8,10,11], 12, "Enigmatic")
  );
  sc.ScaleInfo.register(
    "spanish",
    Scale([0,1,4,5,7,8,10], 12, "Spanish")
  );
  // ### modes of whole tones with added note ->
  sc.ScaleInfo.register(
	"leadingWhole",
    Scale([0,2,4,6,8,10,11], 12, "Leading Whole Tone")
  );
  sc.ScaleInfo.register(
    "lydianMinor",
    Scale([0,2,4,6,7,8,10], 12, "Lydian Minor")
  );
  sc.ScaleInfo.register(
    "neapolitanMajor",
    Scale([0,1,3,5,7,9,11], 12, "Neapolitan Major")
  );
  sc.ScaleInfo.register(
    "locrianMajor",
    Scale([0,2,4,5,6,8,10], 12, "Locrian Major")
  );
  // ### 8 note scales
  sc.ScaleInfo.register(
    "diminished",
    Scale([0,1,3,4,6,7,9,10], 12, "Diminished")
  );
  sc.ScaleInfo.register(
    "diminished2",
    Scale([0,2,3,5,6,8,9,11], 12, "Diminished 2")
  );
  // ### 12 note scales
  sc.ScaleInfo.register(
    "chromatic",
    Scale([0,1,2,3,4,5,6,7,8,9,10,11], 12, "Chromatic")
  );
  // ### TWENTY-FOUR TONES PER OCTAVE
  sc.ScaleInfo.register(
    "chromatic24",
    Scale([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], 24, "Chromatic 24")
  );
  // ### maqam ajam
  sc.ScaleInfo.register(
    "ajam",
    Scale([0,4,8,10,14,18,22], 24, "Ajam")
  );
  sc.ScaleInfo.register(
    "jiharkah",
    Scale([0,4,8,10,14,18,21], 24, "Jiharkah")
  );
  sc.ScaleInfo.register(
    "shawqAfza",
    Scale([0,4,8,10,14,16,22], 24, "Shawq Afza")
  );
  // ### maqam sikah
  sc.ScaleInfo.register(
    "sikah",
    Scale([0,3,7,11,14,17,21], 24, "Sikah")
  );
  sc.ScaleInfo.register(
    "sikahDesc",
    Scale([0,3,7,11,13,17,21], 24, "Sikah Descending")
  );
  sc.ScaleInfo.register(
    "huzam",
    Scale([0,3,7,9,15,17,21], 24, "Huzam")
  );
  sc.ScaleInfo.register(
    "iraq",
    Scale([0,3,7,10,13,17,21], 24, "Iraq")
  );
  sc.ScaleInfo.register(
    "bastanikar",
    Scale([0,3,7,10,13,15,21], 24, "Bastanikar")
  );
  sc.ScaleInfo.register(
    "mustar",
    Scale([0,5,7,11,13,17,21], 24, "Mustar")
  );
  // ### maqam bayati
  sc.ScaleInfo.register(
    "bayati",
    Scale([0,3,6,10,14,16,20], 24, "Bayati")
  );
  sc.ScaleInfo.register(
    "karjighar",
    Scale([0,3,6,10,12,18,20], 24, "Karjighar")
  );
  sc.ScaleInfo.register(
    "husseini",
    Scale([0,3,6,10,14,17,21], 24, "Husseini")
  );
  // ### maqam nahawand
  sc.ScaleInfo.register(
    "nahawand",
    Scale([0,4,6,10,14,16,22], 24, "Nahawand")
  );
  sc.ScaleInfo.register(
    "nahawandDesc",
    Scale([0,4,6,10,14,16,20], 24, "Nahawand Descending")
  );
  sc.ScaleInfo.register(
    "farahfaza",
    Scale([0,4,6,10,14,16,20], 24, "Farahfaza")
  );
  sc.ScaleInfo.register(
    "murassah",
    Scale([0,4,6,10,12,18,20], 24, "Murassah")
  );
  sc.ScaleInfo.register(
    "ushaqMashri",
    Scale([0,4,6,10,14,17,21], 24, "Ushaq Mashri")
  );
  // ### maqam rast
  sc.ScaleInfo.register(
    "rast",
    Scale([0,4,7,10,14,18,21], 24, "Rast")
  );
  sc.ScaleInfo.register(
    "rastDesc",
    Scale([0,4,7,10,14,18,20], 24, "Rast Descending")
  );
  sc.ScaleInfo.register(
    "suznak",
    Scale([0,4,7,10,14,16,22], 24, "Suznak")
  );
  sc.ScaleInfo.register(
    "nairuz",
    Scale([0,4,7,10,14,17,20], 24, "Nairuz")
  );
  sc.ScaleInfo.register(
    "yakah",
    Scale([0,4,7,10,14,18,21], 24, "Yakah")
  );
  sc.ScaleInfo.register(
    "yakahDesc",
    Scale([0,4,7,10,14,18,20], 24, "Yakah Descending")
  );
  sc.ScaleInfo.register(
    "mahur",
    Scale([0,4,7,10,14,18,22], 24, "Mahur")
  );
  // ### maqam hijaz
  sc.ScaleInfo.register(
    "hijaz",
    Scale([0,2,8,10,14,17,20], 24, "Hijaz")
  );
  sc.ScaleInfo.register(
    "hijazDesc",
    Scale([0,2,8,10,14,16,20], 24, "Hijaz Descending")
  );
  sc.ScaleInfo.register(
    "zanjaran",
    Scale([0,2,8,10,14,18,20], 24, "Zanjaran")
  );
  // ### maqam saba
  sc.ScaleInfo.register(
	"saba",
    Scale([0,3,6,8,12,16,20], 24, "Saba")
  );
  sc.ScaleInfo.register(
    "zamzam",
    Scale([0,2,6,8,14,16,20], 24, "Zamzam")
  );
  // ### maqam kurd
  sc.ScaleInfo.register(
    "kurd",
    Scale([0,2,6,10,14,16,20], 24, "Kurd")
  );
  sc.ScaleInfo.register(
    "kijazKarKurd",
    Scale([0,2,8,10,14,16,22], 24, "Kijaz Kar Kurd")
  );
  // ### maqam nawa Athar
  sc.ScaleInfo.register(
    "nawaAthar",
    Scale([0,4,6,12,14,16,22], 24, "Nawa Athar")
  );
  sc.ScaleInfo.register(
    "nikriz",
    Scale([0,4,6,12,14,18,20], 24, "Nikriz")
  );
  sc.ScaleInfo.register(
    "atharKurd",
    Scale([0,2,6,12,14,16,22], 24, "Athar Kurd")
  );

  sc.Scale = Scale;

})(sc);

(function(sc) {
  "use strict";

  /**
   * @name *RGen
   * @description
   * Random Generator
   * @arguments _([seed])_
   * @example
   *  r = sc.RGen();
   *  r.next();
   */
  function RGen(seed) {
    if (!(this instanceof RGen)) {
      return new RGen(seed);
    }
    if (typeof seed !== "number") {
      seed = Date.now();
    }
    var hash = seed;
    hash += ~(hash <<  15);
    hash ^=   hash >>> 10;
    hash +=   hash <<  3;
    hash ^=   hash >>> 6;
    hash += ~(hash <<  11);
    hash ^=   hash >>> 16;

    this.s1 = 1243598713 ^ seed;
    this.s2 = 3093459404 ^ seed;
    this.s3 = 1821928721 ^ seed;
    if (this.s1 <  2) { this.s1 = 1243598713; }
    if (this.s2 <  8) { this.s2 = 3093459404; }
    if (this.s3 < 16) { this.s3 = 1821928721; }
  }

  RGen.prototype.trand = function() {
    this.s1 = ((this.s1 & 4294967294) << 12) ^ (((this.s1 << 13) ^  this.s1) >>> 19);
    this.s2 = ((this.s2 & 4294967288) <<  4) ^ (((this.s2 <<  2) ^  this.s2) >>> 25);
    this.s3 = ((this.s3 & 4294967280) << 17) ^ (((this.s3 <<  3) ^  this.s3) >>> 11);
    return this.s1 ^ this.s2 ^ this.s3;
  };

  var _i = new Uint32Array(1);
  var _f = new Float32Array(_i.buffer);

  /**
   * @name next
   * @description
   * return a number from 0.0 to 0.999...
   * @arguments _none_
   * @example
   *  r = sc.RGen(100);
   *  r.next(); // => 0.6258506774902344
   *  r.next(); // => 0.4134453535079956
   *  r.next(); // => 0.13581514358520508
   */
  RGen.prototype.next = function() {
    _i[0] = 0x3F800000 | (this.trand() >>> 9);
    return _f[0] - 1;
  };

  sc.RGen = RGen;

})(sc);

(function(sc) {
  "use strict";

  function extend(child, parent) {
    for (var key in parent) {
      if (parent.hasOwnProperty(key)) {
        child[key] = parent[key];
      }
    }
    function Ctor() {
      this.constructor = child;
    }
    Ctor.prototype  = parent.prototype;
    child.prototype = new Ctor();
    child.__super__ = parent.prototype;
    return child;
  }

  // # Pattern
  function Pattern() {
    if (!(this instanceof Pattern)) {
      return new Pattern();
    }
    this.count = 0;
  }
  Pattern.prototype.next = function() {
    return null;
  };
  Pattern.prototype.valueOf = function(item) {
    return (typeof item.next === "function") ? item.next() : item;
  };
  Pattern.prototype.reset = function() {
    this.count = 0;
  };
  sc.Pattern = Pattern;

  /**
   * @name *Pser
   * @description
   * is like `Pseq`, however the repeats variable gives *the number of items* returned instead of the number of complete cycles
   * @arguments _(list [, repeat=1, offset=0])_
   * @example
   *  p = sc.Pser([1,2,3], 4);
   *  p.next(); // => 1
   *  p.next(); // => 2
   *  p.next(); // => 3
   *  p.next(); // => 1
   *  p.next(); // => null
   */
  function Pser(list, repeats, offset) {
    if (!(this instanceof Pser)) {
      return new Pser(list, repeats, offset);
    }
    Pattern.call(this);
    repeats = (typeof repeats === "number") ? repeats : 1;
    offset  = (typeof offset  === "number") ? offset  : 0;

    this.list = list;
    this.repeats = repeats !== Infinity ? Math.max(0, repeats)|0 : Infinity;
    this.offset  = Math.max(0, offset )|0;
  }
  extend(Pser, Pattern);

  Pser.prototype.next = function() {
    if (this.count >= this.repeats) {
      return null;
    }
    var index = (this.count + this.offset) % this.list.length;
    var item  = this.list[index];
    var value = this.valueOf(item);
    if (value !== null) {
      if (typeof item.next !== "function") {
        this.count += 1;
      }
      return value;
    } else {
      if (typeof item.reset === "function") {
        item.reset();
      }
      this.count += 1;
      return this.next();
    }
  };
  sc.Pser = Pser;

  /**
   * @name *Pseq
   * @description
   * Cycles over a list of values. The repeats variable gives the number of times to repeat the entire list.
   * @arguments _(list [, repeat=1, offset=0])_
   * @example
   *  p = sc.Pseq([1,2,3], 2);
   *  p.next(); // => 1
   *  p.next(); // => 2
   *  p.next(); // => 3
   *  p.next(); // => 1
   *  p.next(); // => 2
   *  p.next(); // => 3
   *  p.next(); // => null
   */
  function Pseq(list, repeats, offset) {
    if (!(this instanceof Pseq)) {
      return new Pseq(list, repeats, offset);
    }
    Pser.call(this, list, repeats, offset);
    this.repeats *= list.length;
  }
  extend(Pseq, Pser);
  sc.Pseq = Pseq;

  /**
   * @name *Pshuf
   * @description
   * Returns a shuffled version of the *list* item by item, with n *repeats*.
   * @arguments _(list [, repeats=1, seed=nil])_
   * @example
   *  p = sc.Pshuf([1,2,3], 5, 12345);
   *  p.next(); // => 2
   *  p.next(); // => 1
   *  p.next(); // => 3
   *  p.next(); // => 2
   *  p.next(); // => 1
   *  p.next(); // => null
   */
  function Pshuf(list, repeats, seed) {
    if (!(this instanceof Pshuf)) {
      return new Pshuf(list, repeats, seed);
    }
    Pser.call(this, list, repeats, 0);
    var rand = new sc.RGen(seed);
    this.list.sort(function() {
      return rand.next() - 0.5;
    });
  }
  extend(Pshuf, Pser);
  sc.Pshuf = Pshuf;

  /**
   * @name *Prand
   * @description
   * Embed one item from the list at random for each repeat.
   * @arguments _(list [, repeats=1, seed=nil])_
   * @example
   *  p = sc.Prand([1,2,3], 5, 12345);
   *  p.next(); // => 3
   *  p.next(); // => 1
   *  p.next(); // => 2
   *  p.next(); // => 1
   *  p.next(); // => 3
   *  p.next(); // => null
   */
  function Prand(list, repeats, seed) {
    if (!(this instanceof Prand)) {
      return new Prand(list, repeats, seed);
    }
    Pser.call(this, list, repeats, 0);
    var rand = new sc.RGen(seed);
    this._rand = rand.next.bind(rand);
  }
  extend(Prand, Pser);

  Prand.prototype.next = function() {
    if (this.count >= this.repeats) {
      return null;
    }
    var index = (this._rand() * this.list.length)|0;
    var item  = this.list[index];
    var value = this.valueOf(item);
    if (value !== null) {
      if (typeof item.next !== "function") {
        this.count += 1;
      }
      return value;
    } else {
      if (typeof item.reset === "function") {
        item.reset();
      }
      this.count += 1;
      return this.next();
    }
  };
  sc.Prand = Prand;

  /**
   * @name *Pseries
   * @description
   * Returns a stream that behaves like an arithmetric series.
   * @arguments _([start=0, step=1, length=inf])_
   * @example
   *  p = sc.Pseries(0, 2, 5);
   *  p.next(); // => 0
   *  p.next(); // => 2
   *  p.next(); // => 4
   *  p.next(); // => 6
   *  p.next(); // => 8
   *  p.next(); // => null
   */
  function Pseries(start, step, length) {
    if (!(this instanceof Pseries)) {
      return new Pseries(start, step, length);
    }
    Pattern.call(this);
    start  = (typeof start  === "number") ? start  : 0;
    length = (typeof length === "number") ? length : Infinity;

    this.start  = start;
    this.value  = this.start;
    this.step   = step || 1;
    this.length = length !== Infinity ? Math.max(0, length)|0 : Infinity;
  }
  extend(Pseries, Pattern);

  Pseries.prototype.next = function() {
    if (this.count < this.length) {
      var step = this.valueOf(this.step);
      if (step !== null) {
        var outval = this.value;
        this.value += step;
        this.count += 1;
        return outval;
      }
    }
    return null;
  };
  sc.Pseries = Pseries;

  /**
   * @name *Pgeom
   * @description
   * Returns a stream that behaves like a geometric series.
   * @arguments _([start=0, grow=1, length=inf])_
   * @example
   *  p = sc.Pgeom(1, 2, 5);
   *  p.next(); // => 1
   *  p.next(); // => 2
   *  p.next(); // => 4
   *  p.next(); // => 8
   *  p.next(); // => 16
   *  p.next(); // => null
   */
  function Pgeom(start, grow, length) {
    if (!(this instanceof Pgeom)) {
      return new Pgeom(start, grow, length);
    }
    Pattern.call(this);
    start  = (typeof start  === "number") ? start  : 0;
    length = (typeof length === "number") ? length : Infinity;

    this.start  = start;
    this.value  = this.start;
    this.grow   = grow || 1;
    this.length = length !== Infinity ? Math.max(0, length)|0 : Infinity;
  }
  extend(Pgeom, Pattern);

  Pgeom.prototype.next = function() {
    if (this.count < this.length) {
      var grow = this.valueOf(this.grow);
      if (grow !== null) {
        var outval = this.value;
        this.value *= grow;
        this.count += 1;
        return outval;
      }
    }
    return null;
  };
  sc.Pgeom = Pgeom;

})(sc);

})(this.self||global);
