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

(function(sc) {
  "use strict";

  /**
   * absolute value
   * @example
   *  (-10).abs(); // => 10
   *  [ -2, -1, 0, 1, 2 ].abs(); // => [ 2, 1, 0, 1, 2 ]
   */
  sc.register("abs", {
    Number: function() {
      return Math.abs(this);
    },
    Array: function() {
      return this.map(function(x) { return x.abs(); });
    },
    Function: function() {
      var func = this;
      return function() {
        return func.apply(func, arguments).abs();
      };
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * (a - b).abs()
   * @example
   *  (10).absdif(15); // => 5
   */
  sc.register("absdif", {
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
    },
    Function: function() {
      var func = this;
      return function() {
        return func.apply(func, arguments).absdif();
      };
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Arccosine
   */
  sc.register("acos", {
    Number: function() {
      return Math.acos(this);
    },
    Array: function() {
      return this.map(function(x) { return x.acos(); });
    },
    Function: function() {
      var func = this;
      return function() {
        return func.apply(func, arguments).acos();
      };
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Adds an item to an Array if there is space. This method may return a new Array.
   * @arguments _(item)_
   * @example
   *  [1,2,3].add(4); // => [ 1, 2, 3, 4 ]
   */
  sc.register("add", {
    Array: function(item) {
      var ret = this.slice();
      ret.push(item);
      return ret;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Adds all the elements of aCollection to the contents of the receiver. This method may return a new Array.
   * @arguments _(items)_
   * @example
   *  [1, 2, 3, 4].addAll([7, 8, 9]); // => [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
   */
  sc.register(["addAll", "concat", "++"], {
    Array: function(items) {
      return this.concat(items);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Inserts the *item* before the contents of the receiver, possibly returning a new Array.
   * @arguments _(item)_
   * @example
   *  [1, 2, 3, 4].addFirst(999); // [ 999, 2, 3, 4 ]
   */
  sc.register("addFirst", {
    Array: function(item) {
      return [item].concat(this);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("addIfNotNil", {
    Array: function(item) {
      if (item !== null) {
        return this.concat([item]);
      }
      return this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("amclip", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("ampdb", {
    Number: function() {
      return Math.log(this) * Math.LOG10E * 20;
    },
    Array: function() {
      return this.map(function(x) { return x.ampdb(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("any", {
    Array: function(func) {
      func = sc.func(func);
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (func(this[i], i)) { return true; }
      }
      return false;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  var asArray = function() {
    return [this];
  };

  sc.register("asArray", {
    Number : asArray,
    Boolean: asArray,
    Array: function() {
      return this;
    },
    String  : asArray,
    Function: asArray
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("asBoolean", {
    Number: function() {
      return this !== 0;
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("asFloat", {
    Number: function() {
      return this;
    },
    Array: function() {
      return this.map(function(x) { return x.asFloat(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("asFloat32Array", {
    Array: function() {
      return new Float32Array(this);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("asFloat64Array", {
    Array: function() {
      return new Float64Array(this);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  var asFunction = function() {
    var that = this;
    return function() { return that; };
  };

  sc.register("asFunction", {
    Number: asFunction,
    Array : asFunction,
    String: asFunction,
    Function: function() {
      return this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("asInt16Array", {
    Array: function() {
      return new Int16Array(this);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("asInt32Array", {
    Array: function() {
      return new Int32Array(this);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("asInt8Array", {
    Array: function() {
      return new Int8Array(this);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("asInteger", {
    Number: function() {
      return this|0;
    },
    Array: function() {
      return this.map(function(x) { return x.asInteger(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("asNumber", {
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

})(sc);

(function(sc) {
  "use strict";

  var asString = function() {
    return "" + this;
  };

  sc.register("asString", {
    Number : asString,
    Boolean: asString,
    Array  : asString,
    String: function() {
      return this;
    },
    Function: asString
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("asUint16Array", {
    Array: function() {
      return new Uint16Array(this);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("asUint32Array", {
    Array: function() {
      return new Uint32Array(this);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("asUint8Array", {
    Array: function() {
      return new Uint8Array(this);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Arcsine
   */
  sc.register("asin", {
    Number: function() {
      return Math.asin(this);
    },
    Array: function() {
      return this.map(function(x) { return x.asin(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Return the item at *index*.
   * @arguments _(index)_
   * @example
   *  x = [10,20,30];
   *  y = [0,0,2,2,1];
   *  x.at(y); // returns [ 10, 10, 30, 30, 20 ]
   */
  sc.register(["at", "@"], {
    Array: function(index) {
      if (Array.isArray(index)) {
        return index.map(function(index) {
          return this.at(index);
        }, this);
      }
      return this[index|0];
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("atDec", {
    Array: function(index, dec) {
      dec = dec === void 0 ? 1 : dec;
      return this.put(index, this.at(index).opSub(dec));
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("atInc", {
    Array: function(index, inc) {
      inc = inc === void 0 ? 1 : inc;
      return this.put(index, this.at(index).opAdd(inc));
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("atModify", {
    Array: function(index, func) {
      return this.put(index, sc.func(func)(this.at(index), index));
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Arctangent
   */
  sc.register("atan", {
    Number: function() {
      return Math.atan(this);
    },
    Array: function() {
      return this.map(function(x) { return x.atan(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("atan2", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("biexp", {
    Number: function(inCenter, inMin, inMax, outCenter, outMin, outMax, clip) {
      if (Array.isArray(inCenter) || Array.isArray(inMin) ||Array.isArray(inMax) ||
          Array.isArray(outCenter) || Array.isArray(outMin) || Array.isArray(outMax)) {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("bilin", {
    Number: function(inCenter, inMin, inMax, outCenter, outMin, outMax, clip) {
      if (Array.isArray(inCenter) || Array.isArray(inMin) ||Array.isArray(inMax) ||
          Array.isArray(outCenter) || Array.isArray(outMin) || Array.isArray(outMax)) {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("bilinrand", {
    Number: function() {
      return (Math.random() - Math.random()) * this;
    },
    Array: function() {
      return this.map(function(x) { return x.bilinrand(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("binaryValue", {
    Number: function() {
      return this > 0 ? 1 : 0;
    },
    Array: function() {
      return this.map(function(x) { return x.binaryValue(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register(["bitAnd", "&"], {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register(["bitNot", "~"], {
    Number: function() {
      return ~this;
    },
    Array: function() {
      return this.map(function(x) { return x.bitNot(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register(["bitOr", "|"], {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("bitTest", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register(["bitXor", "^"], {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("blendAt", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("bubble", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * next larger integer.
   */
  sc.register("ceil", {
    Number: function() {
      return Math.ceil(this);
    },
    Array: function() {
      return this.map(function(x) { return x.ceil(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Choose an element from the collection at random.
   * @example
   *  [1, 2, 3, 4].choose();
   */
  sc.register("choose", {
    Array: function() {
      return this[(Math.random() * this.length)|0];
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("clip", {
    Number: function(lo, hi) {
      if (Array.isArray(lo) || Array.isArray(hi)) {
        return [this,lo,hi].flop().map(function(items) {
          return items[0].clip(items[1], items[2]);
        });
      }
      return Math.max(lo, Math.min(this, hi));
    },
    Array: function(lo, hi) {
      return this.map(function(x) { return x.clip(lo, hi); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("clip2", {
    Number: function(num) {
      if (Array.isArray(num)) {
        return num.map(function(num) { return this.clip2(num); }, this);
      }
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Same as `at`, but values for index greater than the size of the ArrayedCollection will be clipped to the last index.
   * @example
   *  [ 1, 2, 3 ].clipAt(13); // => 3
   *  [ 1, 2, 3 ].clipAt([ 0, 1, 2, 3 ]); // => [ 1, 2, 3, 3 ]
   */
  sc.register(["clipAt", "|@|"], {
    Array: function(index) {
      if (Array.isArray(index)) {
        return index.map(function(index) {
          return this.clipAt(index);
        }, this);
      }
      return this[(index|0).clip(0, this.length-1)];
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Same as `wrapExtend` but the sequences "clip" (return their last element) rather than wrapping.
   * @arguments _(size)_
   * @example
   *  [ 1, 2, 3 ].clipExtend(9); // => [ 1, 2, 3, 3, 3, 3, 3, 3, 3 ]
   */
  sc.register("clipExtend", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Same as `put`, but values for index greater than the size of the ArrayedCollection will be clipped to the last index.
   * @arguments _(index, item)_
   */
  sc.register("clipPut", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("clipSwap", {
    Array: function(i, j) {
      i = (i|0).clip(0, this.length-1);
      j = (j|0).clip(0, this.length-1);
      var t = this[i];
      this[i] = this[j];
      this[j] = t;
      return this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("clump", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("clumps", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("coin", {
    Number: function() {
      return Math.random() < this;
    },
    Array: function() {
      return this.map(function(x) { return x.coin(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("collect", {
    Number: function(func) {
      func = sc.func(func);
      var a = new Array(this|0);
      for (var i = 0, imax = a.length; i < imax; ++i) {
        a[i] = func(i);
      }
      return a;
    },
    Array: function(func) {
      return this.map(sc.func(func));
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("copy", {
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

})(sc);

(function(sc) {
  "use strict";

  var copyFromStart = function(end) {
    if (Array.isArray(end)) {
      return end.map(function(end) {
        return this.copyFromStart(end);
      }, this);
    }
    end = Math.max(0, end|0);
    return this.slice(0, end + 1);
  };

  sc.register("copyFromStart", {
    Array : copyFromStart,
    String: copyFromStart
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Return a new Array which is a copy of the indexed slots of the receiver from *start* to *end*.
   * @arguments _(start, end)_
   * @example
   *  [1, 2, 3, 4, 5].copyRange(1, 3); // [ 2, 3, 4 ]
   */
  var copyRange = function(start, end) {
    if (Array.isArray(start) || Array.isArray(end)) {
      return [start, end].flop().map(function(items) {
        return this.copyRange(items[0], items[1]);
      }, this);
    }
    start = Math.max(0, start|0);
    end   = Math.max(0, end|0);
    return this.slice(start, end + 1);
  };

  sc.register("copyRange", {
    Array : copyRange,
    String: copyRange
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Return a new *Array* consisting of the values starting at *first*, then every step of the distance between *first* and *second*, up until *last*.
   * @arguments _(first, second, last)_
   * @example
   *   [1, 2, 3, 4, 5, 6].copySeries(0, 2, 5); // => [ 1, 3, 5 ]
   */
  sc.register("copySeries", {
    Array: function(first, second, last) {
      return this.at(first.series(second, last));
    }
  });

})(sc);

(function(sc) {
  "use strict";

  var copyToEnd = function(start) {
    if (Array.isArray(start)) {
      return start.map(function(start) {
        return this.copyToEnd(start);
      }, this);
    }
    start = Math.max(0, start|0);
    return this.slice(start);
  };

  sc.register("copyToEnd", {
    Array : copyToEnd,
    String: copyToEnd
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Cosine
   */
  sc.register("cos", {
    Number: function() {
      return Math.cos(this);
    },
    Array: function() {
      return this.map(function(x) { return x.cos(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Hyperbolic cosine
   */
  sc.register("cosh", {
    Number: function() {
      return (Math.pow(Math.E, this) + Math.pow(Math.E, -this)) * 0.5;
    },
    Array: function() {
      return this.map(function(x) { return x.cosh(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("count", {
    Array: function(func) {
      func = sc.func(func);
      var sum = 0;
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (func(this[i], i)) { ++sum; }
      }
      return sum;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Convert cycles per second to MIDI note.
   * @returns midi note
   * @example
   *  (440).cpsmidi(); // => 69
   *  Array.range(440, 880, 110).cpsmidi(); // => [69, 72.8631, 76.0195, 78.6882]
   */
  sc.register("cpsmidi", {
    Number: function() {
      return Math.log(Math.abs(this) * 1/440) * Math.LOG2E * 12 + 69;
    },
    Array: function() {
      return this.map(function(x) { return x.cpsmidi(); });
    },
    Function: function() {
      var func = this;
      return function() {
        return func.apply(func, arguments).cpsmidi();
      };
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("cpsoct", {
    Number: function() {
      return Math.log(Math.abs(this) * 1/440) * Math.LOG2E + 4.75;
    },
    Array: function() {
      return this.map(function(x) { return x.cpsoct(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * the cube of the number
   */
  sc.register("cubed", {
    Number: function() {
      return this * this * this;
    },
    Array: function() {
      return this.map(function(x) { return x.cubed(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("curdle", {
    Array: function(probability) {
      return this.separate(function() {
        return probability.coin();
      });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("curvelin", {
    Number: function(inMin, inMax, outMin, outMax, curve, clip) {
      if (Array.isArray(inMin) || Array.isArray(inMax) ||
          Array.isArray(outMin) || Array.isArray(outMax)) {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("dbamp", {
    Number: function() {
      return Math.pow(10, this * 0.05);
    },
    Array: function() {
      return this.map(function(x) { return x.dbamp(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("degrad", {
    Number: function() {
      return this * Math.PI / 180;
    },
    Array: function() {
      return this.map(function(x) { return x.degrad(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("degreeToKey", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("delimit", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("detect", {
    Array: function(func) {
      func = sc.func(func);
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (func(this[i], i)) { return this[i]; }
      }
      return null;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("detectIndex", {
    Array: function(func) {
      func = sc.func(func);
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (func(this[i], i)) { return i; }
      }
      return -1;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("difference", {
    Array: function(that) {
      return this.slice().removeAll(that);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("differentiate", {
    Array: function() {
      var prev = 0;
      return this.map(function(item) {
        var ret = item - prev;
        prev = item;
        return ret;
      });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("difsqr", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("distort", {
    Number: function() {
      return this / (1 + Math.abs(this));
    },
    Array: function() {
      return this.map(function(x) { return x.distort(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Integer Division
   * @example
   *  (10).div(3);       // => 3
   *  [10,20,30].div(3); // => [ 3, 6, 10 ]
   */
  sc.register("div", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("do", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("doAdjacentPairs", {
    Array: function(func) {
      func = sc.func(func);
      for (var i = 0, imax = this.length - 1; i < imax; ++i) {
        func(this[i], this[i+1], i);
      }
      return this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("drop", {
    Array: function(n) {
      n |= 0;
      if (n < 0) {
        return this.slice(0, this.length + n);
      } else {
        return this.slice(n);
      }
    }
  });

})(sc);

(function(sc) {
  "use strict";

  var dup = function(n) {
    n = n === void 0 ? 2 : n;
    var a = new Array(n|0);
    for (var i = 0, imax = a.length; i < imax; ++i) {
      a[i] = this;
    }
    return a;
  };

  sc.register("dup", {
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
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("equalWithPrecision", {
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

})(sc);

(function(sc) {
  "use strict";

  var equals = function(arg) {
    return this === arg;
  };

  sc.register(["equals", "=="], {
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
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("even", {
    Number: function() {
      return (this & 1) === 0;
    },
    Array: function() {
      return this.map(function(x) { return x.even(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register(["every", "sc_every"], {
    Array: function(func) {
      func = sc.func(func);
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (!func(this[i], i)) { return false; }
      }
      return true;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("excess", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("exclusivelyBetween", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * e to the power of the receiver.
   */
  sc.register("exp", {
    Number: function() {
      return Math.exp(this);
    },
    Array: function() {
      return this.map(function(x) { return x.exp(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("expexp", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("explin", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Fill a SequenceableCollection with random values in the range minVal to maxVal with exponential distribution.
   * @arguments _(size [, minVal=0, maxVal=1])_
   * @example
   *  Array.exprand(8, 1, 100);
   */
  sc.register("*exprand", {
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
   * @arguments _(num)_
   */
  sc.register("exprand", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Extends the object to match size by adding a number of items. If size is less than receiver size then truncate. This method may return a new Array.
   * @arguments _(size, item)_
   * @example
   *  [1, 2, 3, 4].extend(10, 9); // => [ 1, 2, 3, 4, 9, 9, 9, 9, 9, 9 ]
   */
  sc.register("extend", {
    Array: function(size, item) {
      size = Math.max(0, size|0);
      var a = new Array(size);
      for (var i = 0; i < size; ++i) {
        a[i] = (i < this.length) ? this[i] : item;
      }
      return a;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("factorial", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Fill an Array with a fibonacci series.
   * @arguments _(size [, a=0, b=1])_
   * @example
   *  Array.fib(5); // => [ 1, 1, 2, 3, 5 ]
   */
  sc.register("*fib", {
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
  sc.register("fib", {
    Number: function(a, b) {
      if (Array.isArray(a) || Array.isArray(b)) {
        return [this,a,b].flop().map(function(items) {
          return items[0].geom(items[1], items[2]);
        });
      }
      return Array.fib(this, a, b);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Creates an Array of the given size, the elements of which are determined by evaluation the given function.
   * @example
   *  Array.fill(3, 5); // => [ 5, 5, 5 ]
   *  Array.fill(3, function(i) { return i * 2; }) // => [ 0, 2, 4 ]
   */
  sc.register("*fill", {
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
   *  [1,2,3,4].fill(4); // [ 4, 4, 4, 4 ]
   */
  sc.register("fill", {
    Array: function(item) {
      for (var i = 0, imax = this.length; i < imax; i++) {
        this[i] = item;
      }
      return this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("*fill2D", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("*fill3D", {
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

})(sc);

(function(sc) {
  "use strict";

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

  sc.register("*fillND", {
    Array: function(dimensions, func) {
      return fillND(dimensions, sc.func(func), []);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("find", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("findAll", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Return the first element of the collection.
   * @arguments _none_
   * @example
   *  [3, 4, 5].first() # => 3
   */
  sc.register("first", {
    Array: function() {
      return this[0];
    }
  });

})(sc);

(function(sc) {
  "use strict";

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

  sc.register("flat", {
    Array: function() {
      return flat(this, []);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("flatIf", {
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

})(sc);

(function(sc) {
  "use strict";

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

  sc.register("flatSize", {
    Array: function() {
      return flatSize(this);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("flatten", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * next smaller integer
   */
  sc.register("floor", {
    Number: function() {
      return Math.floor(this);
    },
    Array: function() {
      return this.map(function(x) { return x.floor(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("flop", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * the folded value, a bitwise or with aNumber
   * @arguments _(lo, hi)_
   */
  sc.register("fold", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * the folded value, a bitwise or with aNumber
   */
  sc.register("fold2", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register(["foldAt", "@|@"], {
    Array: function(index) {
      if (Array.isArray(index)) {
        return index.map(function(index) {
          return this.foldAt(index);
        }, this);
      }
      return this[(index|0).fold(0, this.length-1)];
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("foldExtend", {
    Array: function(size) {
      size = Math.max(0, size|0);
      var a = new Array(size);
      for (var i = 0; i < size; ++i) {
        a[i] = this.foldAt(i);
      }
      return a;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("foldPut", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("foldSwap", {
    Array: function(i, j) {
      i = (i|0).fold(0, this.length-1);
      j = (j|0).fold(0, this.length-1);
      var t = this[i];
      this[i] = this[j];
      this[j] = t;
      return this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("for", {
    Number: function(endValue, func) {
      func = sc.func(func);
      var i = this, j = 0;
      while (i <= endValue) { func(i++, j++); }
      return this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("forBy", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("forSeries", {
    Number: function(second, last, func) {
      return this.forBy(last, second - this, func);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * fractional part
   */
  sc.register("frac", {
    Number: function() {
      var frac = this - Math.floor(this);
      return frac < 0 ? 1 + frac : frac;
    },
    Array: function() {
      return this.map(function(x) { return x.frac(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("gauss", {
    Number: function(standardDeviation) {
      return (((Math.sqrt(-2*Math.log(Math.random())) * Math.sin(Math.random() * 2 * Math.PI)) * standardDeviation) + this);
    },
    Array: function(standardDeviation) {
      return this.map(function(x) { return x.gauss(standardDeviation); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("gaussCurve", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("gcd", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Fill an Array with a geometric series.
   * @arguments (size [, start=1, grow=2])
   * @example
   *  Array.geom(5, 1, 3) // => [ 1, 3, 9, 27, 81 ]
   */
  sc.register("*geom", {
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
  sc.register("geom", {
    Number: function(start, grow) {
      if (Array.isArray(start) || Array.isArray(grow)) {
        return [this,start,grow].flop().map(function(items) {
          return items[0].geom(items[1], items[2]);
        });
      }
      return Array.geom(this, start, grow);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register(["greater", ">"], {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register(["greaterThan", ">="], {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("half", {
    Number: function() {
      return this * 0.5;
    },
    Array: function() {
      return this.map(function(x) { return x.half(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("hanWindow", {
    Number: function() {
      if (this < 0 || this > 1) { return 0; }
      return 0.5 - 0.5 * Math.cos(this * 2 * Math.PI);
    },
    Array: function() {
      return this.map(function(x) { return x.hanWindow(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("histo", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("hypot", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("hypotApx", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("includes", {
    Array: function(item) {
      return this.indexOf(item) !== -1;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("includesAll", {
    Array: function(item) {
      for (var i = 0, imax = item.length; i < imax; ++i) {
        if (this.indexOf(item[i]) === -1) { return false; }
      }
      return true;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("includesAny", {
    Array: function(item) {
      for (var i = 0, imax = item.length; i < imax; ++i) {
        if (this.indexOf(item[i]) !== -1) { return true; }
      }
      return false;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("inclusivelyBetween", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("indexIn", {
    Array: function(item) {
      var i, j = this.indexOfGreaterThan(item);
      if (j === -1) { return this.length - 1; }
      if (j ===  0) { return j; }
      i = j - 1;
      return ((item - this[i]) < (this[j] - item)) ? i : j;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("indexInBetween", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Return the index of an *item* in the collection, or -1 if not found.
   * @arguments _(item [, offset=0])_
   */
  sc.register(["indexOf", "sc_indexOf"], {
    Array: function(item, offset) {
      offset = offset === void 0 ? 0 : offset;
      return this.indexOf(item, offset|0);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Return the index of something in the collection that equals the *item*, or -1 if not found.
   * @arguments _(item [, offset=0])_
   * @example
   *  [[3], [4], [5]].indexOfEqual([5]); // => 2
   */
  sc.register("indexOfEqual", {
    Array: function(item, offset) {
      offset = offset === void 0 ? 0 : offset|0;
      for (var i = offset, imax = this.length; i < imax; i++) {
        if (this[i].equals(item)) { return i; }
      }
      return -1;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Return the first index containing an *item* which is greater than *item*.
   * @arguments _(item)_
   * @example
   *  [10, 5, 77, 55, 12, 123].indexOfGreaterThan(70); // => 2
   */
  sc.register("indexOfGreaterThan", {
    Array: function(item) {
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (this[i] > item) { return i; }
      }
      return -1;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("indicesOf", {
    Array: function(item, offset) {
      offset = offset === void 0 ? 0 : offset|0;
      var a = [];
      for (var i = offset, imax = this.length; i < imax; i++) {
        if (this[i] === item) { a.push(i); }
      }
      return a;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Return an array of indices of things in the collection that equal the *item*, or [] if not found.
   * @arguments _(item [, offset=0])_
   * @example
   *  [7, 8, 7, 6, 5, 6, 7, 6, 7, 8, 9].indicesOfEqual(7); // => [ 0, 2, 6, 8 ]
   */
  sc.register("indicesOfEqual", {
    Array: function(item, offset) {
      offset = offset === void 0 ? 0 : offset|0;
      var a = [];
      for (var i = offset, imax = this.length; i < imax; i++) {
        if (this[i].equals(item)) { a.push(i); }
      }
      return a;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("inject", {
    Array: function(thisValue, func) {
      return this.reduce(sc.func(func), thisValue);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("injectr", {
    Array: function(thisValue, func) {
      return this.reduceRight(sc.func(func), thisValue);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Inserts the *item* into the contents of the receiver. This method may return a new Array.
   * @arguments _(index, item)_
   * @example
   *  [1, 2, 3, 4].insert(1, 999); // [ 1, 999, 3, 4 ]
   */
  sc.register("insert", {
    Array: function(index, item) {
      index = Math.max(0, index|0);
      var ret = this.slice();
      ret.splice(index, 0, item);
      return ret;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("instill", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Fill an `Array` with the interpolated values between the *start* and *end* values.
   * @arguments _(size [, start=0, end=1])_
   * @example
   *  Array.interpolation(5, 3.2, 20.5); // => [3.2, 7.525, 11.850, 16.175, 20.5]
   */
  sc.register("*interpolation", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("invert", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("isArray", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("isBoolean", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("isEmpty", {
    Array: function() {
      return this.length === 0;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("isFunction", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("isNaN", {
    Number: function() {
      return isNaN(this);
    },
    Array: function() {
      return this.map(function(x) { return x.isNaN(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("isNegative", {
    Number: function() {
      return this < 0;
    },
    Array: function() {
      return this.map(function(x) { return x.isNegative(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("isNumber", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("isPositive", {
    Number: function() {
      return this >= 0;
    },
    Array: function() {
      return this.map(function(x) { return x.isPositive(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("isPowerOfTwo", {
    Number: function() {
      var a = Math.log(this) / Math.log(2);
      var b = a|0;
      return a === b;
    },
    Array: function() {
      return this.map(function(x) { return x.isPowerOfTwo(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("isStrictlyPositive", {
    Number: function() {
      return this > 0;
    },
    Array: function() {
      return this.map(function(x) { return x.isStrictlyPositive(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("isString", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("isSubsetOf", {
    Array: function(that) {
      return that.includesAll(this);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("iwrap", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("keep", {
    Array: function(n) {
      n |= 0;
      if (n < 0) {
        return this.slice(this.length + n);
      } else {
        return this.slice(0, n);
      }
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("keyToDegree", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("lace", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Return the last element of the collection.
   * @arguments _none_
   * @example
   *  [3, 4, 5].last(); // => 5
   */
  sc.register("last", {
    Array: function() {
      return this[this.length-1];
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("lastForWhich", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("lastIndex", {
    Array: function() {
      return this.length - 1;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("lastIndexForWhich", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("lcm", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("lcurve", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register(["leftShift", "<<"], {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register(["less", "<"], {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register(["lessThan", "<="], {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("lincurve", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("linexp", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("linlin", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Fill a SequenceableCollection with random values in the range *minVal* to *maxVal* with a linear distribution.
   * @arguments _(size [, minVal=0, maxVal=1])_
   * @example
   *  Array.linrand(8, 1, 100);
   */
  sc.register("*linrand", {
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
   * @arguments _( )_
   * @returns a linearly distributed random number from zero to this.
   * @example
   *  (10).linrand();
   */
  sc.register("linrand", {
    Number: function() {
      return Math.min(Math.random(), Math.random()) * this;
    },
    Array: function() {
      return this.map(function(x) { return x.linrand(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Base e logarithm.
   */
  sc.register("log", {
    Number: function() {
      return Math.log(this);
    },
    Array: function() {
      return this.map(function(x) { return x.log(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Base 10 logarithm.
   */
  sc.register("log10", {
    Number: function() {
      return Math.log(this) * Math.LOG10E;
    },
    Array: function() {
      return this.map(function(x) { return x.log10(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Base 2 logarithm.
   */
  sc.register("log2", {
    Number: function() {
      return Math.log(Math.abs(this)) * Math.LOG2E;
    },
    Array: function() {
      return this.map(function(x) { return x.log2(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("log2Ceil", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("madd", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("max", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("maxDepth", {
    Array: function(max) {
      var res, i, imax;
      max = max === void 0 ? 1 : max;
      res = max;
      for (i = 0, imax = this.length; i < imax; ++i) {
        if (Array.isArray(this[i])) {
          res = Math.max(res, this[i].maxDepth(max+1));
        }
      }
      return res;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Answer the index of the maximum of the results of *function* evaluated for each item in the receiver. The function is passed two arguments, the item and an integer index. If function is nil, then answer the maximum of all items in the receiver.
   * @arguments _([func=nil])_
   * @example
   *  [3.2, 12.2, 13, 0.4].maxIndex(); // => 2
   */
  sc.register("maxIndex", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("maxSizeAtDepth", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register(["maxValue", "maxItem"], {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("mean", {
    Array: function(func) {
      if (func) { func = sc.func(func); }
      return this.sum(func) / this.length;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("middle", {
    Array: function() {
      return this[(this.length - 1) >> 1];
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("middleIndex", {
    Array: function() {
      return (this.length - 1) >> 1;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Convert MIDI note to cycles per second
   * @returns cycles per second
   * @example
   *  (69).midicps(); // => 440
   *  Array.range(69, 81).midicps(); // => [ 440, 466.1637, ... , 830.6093 ]
   */
  sc.register("midicps", {
    Number: function() {
      return 440 * Math.pow(2, (this - 69) * 1/12);
    },
    Array: function() {
      return this.map(function(x) { return x.midicps(); });
    },
    Function: function() {
      var func = this;
      return function() {
        return func.apply(func, arguments).midicps();
      };
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("midiratio", {
    Number: function() {
      return Math.pow(2, this * 1/12);
    },
    Array: function() {
      return this.map(function(x) { return x.midiratio(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("min", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Answer the index of the minimum of the results of *function* evaluated for each item in the receiver. The function is passed two arguments, the item and an integer index. If function is nil, then answer the minimum of all items in the receiver.
   * @arguments _([func=nil])_
   * @example
   *  [3.2, 12.2, 13, 0.4].minIndex(); // => 3
   */
  sc.register("minIndex", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register(["minValue", "minItem"], {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Return a new Array which is the receiver made into a palindrome. The receiver is unchanged.
   * @example
   *  [1, 2, 3, 4].mirror(); // => [1, 2, 3, 4, 3, 2, 1]
   */
  sc.register("mirror", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Return a new Array which is the receiver made into a palindrome with the last element removed. This is useful if the list will be repeated cyclically, the first element will not get played twice. The receiver is unchanged.
   * @example
   *  [1, 2, 3, 4].mirror1(); // => [1, 2, 3, 4, 3, 2]
   */
  sc.register("mirror1", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Return a new Array which is the receiver concatenated with a reversal of itself. The center element is duplicated. The receiver is unchanged.
   * @example
   *  [1, 2, 3, 4].mirror2(); // => [1, 2, 3, 4, 4, 3, 2, 1]
   */
  sc.register("mirror2", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Integer Modulo
   * @example
   *  (10).mod(3); // => 1
   *  [10,20,30].mod(3); // => [ 1, 2, 0 ]
   */
  sc.register("mod", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("mode", {
    Array: function(degree, octave) {
      octave = octave === void 0 ? 12 : octave;
      return this.rotate(degree.neg()).opSub(this.wrapAt(degree)).opMod(octave);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("nearestInList", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("nearestInScale", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * negation
   */
  sc.register("neg", {
    Number: function() {
      return -this;
    },
    Array: function() {
      return this.map(function(x) { return x.neg(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("*new", {
    Array: function(size) {
      return new Array(size|0);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("*newClear", {
    Array: function(size) {
      var a = new Array(size|0);
      for (var i = 0, imax = a.length; i < imax; i++) {
        a[i] = 0;
      }
      return a;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("*newFrom", {
    Array: function(item) {
      return item.slice();
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * the next power of aNumber
   */
  sc.register("nextPowerOf", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * the next power of three
   */
  sc.register("nextPowerOfThree", {
    Number: function() {
      return Math.pow(3, Math.ceil(Math.log(this) / Math.log(3)));
    },
    Array: function() {
      return this.map(function(x) { return x.nextPowerOfThree(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * the number relative to this that is the next power of 2
   */
  sc.register("nextPowerOfTwo", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Returns a new *Array* with the receiver items normalized between *min* and *max*.
   * @arguments _(min=0, max=1)_
   * @example
   *  [1, 2, 3].normalize(-20, 10); // => [ -20, -5, 10 ]
   */
  sc.register("normalize", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Returns the Array resulting from `this[i] / this.sum()`, so that the array will sum to 1.0.
   * @arguments _none_
   * @example
   *  [1, 2, 3].normalizeSum(); // => [ 0.1666, 0.3333, 0.5 ]
   */
  sc.register("normalizeSum", {
    Array: function() {
      return this.opDiv(this.sum());
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("notEmpty", {
    Array: function() {
      return this.length !== 0;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register(["notEquals", "!="], {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("numBits", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("obtain", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("occurrencesOf", {
    Array: function(item) {
      var sum = 0;
      for (var i = 0, imax = this.length; i < imax; ++i) {
        if (this[i] === item || this[i].equals(item)) { ++sum; }
      }
      return sum;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("octcps", {
    Number: function() {
      return 440 * Math.pow(2, this - 4.75);
    },
    Array: function() {
      return this.map(function(x) { return x.octcps(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("odd", {
    Number: function() {
      return (this & 1) === 1;
    },
    Array: function() {
      return this.map(function(x) { return x.odd(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Addition
   * @example
   *  (10).opAdd(2); // => 12
   *  [10,20,30].sc("+")(10); // => [ 20, 30, 40 ]
   */
  sc.register(["opAdd", "+"], {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Division
   * @example
   *  (10).opDiv(2); // => 5
   *  [10,20,30].sc("/")(10); // => [ 1, 2, 3 ]
   */
  sc.register(["opDiv", "/"], {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Modulo
   * @example
   *  (10).opMod(3); // => 1
   *  [10,20,30].sc("%")(3); // => [ 1, 2, 0 ]
   */
  sc.register(["opMod", "%"], {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Multiplication  
   * @example
   *  (10).opMul(2); // => 20
   *  [10,20,30].sc("*")(10); // => [ 100, 200, 300 ]
   */
  sc.register(["opMul", "*"], {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Subtraction
   * @example
   *  (10).opSub(2); // => 8
   *  [10,20,30].sc("-")(10); // => [ 0, 10, 20 ]
   */
  sc.register(["opSub", "-"], {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register(["pairsDo", "keyValuesDo"], {
    Array: function(func) {
      func = sc.func(func);
      for (var i = 0, imax = this.length; i < imax; i += 2) {
        func(this[i], this[i+1], i);
      }
      return this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("partition", {
    Number: function(parts, min) {
      parts = typeof parts === "undefined" ? 2 : parts;
      min = typeof min === "undefined" ? 1 : min;
      var n = this - (min - 1 * parts);
      var a = new Array(n);
      for (var i = 1; i <= n-1; ++i) {
        a[i-1] = i;
      }
      return a.scramble().keep(parts-1).sort().add(n).differentiate().opAdd(min-1);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("performDegreeToKey", {
    Array: function(scaleDegree, stepsPerOctave, accidental) {
      stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
      accidental     = accidental     === void 0 ?  0 : accidental;
      var baseKey = (stepsPerOctave * ((scaleDegree / this.length)|0)) + this.wrapAt(scaleDegree);
      return accidental === 0 ? baseKey : baseKey + (accidental * (stepsPerOctave / 12));
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("performKeyToDegree", {
    Array: function(degree, stepsPerOctave) {
      stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
      var n = ((degree / stepsPerOctave)|0) * this.length;
      var key = degree % stepsPerOctave;
      return this.indexInBetween(key) + n;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("performNearestInList", {
    Array: function(degree) {
      return this[this.indexIn(degree)];
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("performNearestInScale", {
    Array: function(degree, stepsPerOctave) {
      stepsPerOctave = stepsPerOctave === void 0 ? 12 : stepsPerOctave;
      var root = degree.trunc(stepsPerOctave);
      var key  = degree % stepsPerOctave;
      return this.performNearestInList(key) + root;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("permute", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Remove and return the last element of the Array.
   * @arguments _none_
   * @example
   *  [1, 2, 3].pop(); // 3
   */
  sc.register("pop", {
    Array: function() {
      return this.pop();
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("postln", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * this to the power of aNumber
   * @arguments _(num)_
   */
  sc.register(["pow", "**"], {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * the number relative to this that is the previous power of aNumber
   */
  sc.register("previousPowerOf", {
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

})(sc);

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

  sc.register("nthPrime", {
    Number: function() {
      return primelist[this|0];
    },
    Array: function() {
      return this.map(function(x) { return x.nthPrime(); });
    }
  });
  sc.register("prevPrime", {
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
  sc.register("nextPrime", {
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
  sc.register("isPrime", {
    Number: function() {
      return primelist.indexOf(this|0) !== -1;
    },
    Array: function() {
      return this.map(function(x) { return x.isPrime(); });
    }
  });
  sc.register("indexOfPrime", {
    Number: function() {
      return primelist.indexOf(this|0);
    },
    Array: function() {
      return this.map(function(x) { return x.indexOfPrime(); });
    }
  });

  sc.register("factors", {
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

(function(sc) {
  "use strict";

  sc.register("product", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("put", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("putEach", {
    Array: function(keys, values) {
      keys = keys.asArray();
      values = values.asArray();
      keys.map(function(key, i) {
        this[key] = values.wrapAt(i);
      }, this);
      return this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Place *item* at the first index in the collection. Note that if the collection is empty (and therefore has no indexed slots) the item will not be added.
   * @arguments _(item)_
   * @example
   *  [3, 4, 5].putFirst(100); // => [ 100, 4, 5 ]
   *  [].putFirst(100); // => []
   */
  sc.register("putFirst", {
    Array: function(item) {
      if (this.length > 0) { this[0] = item; }
      return this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Place *item* at the last index in the collection. Note that if the collection is empty (and therefore has no indexed slots) the item will not be added.
   * @arguments _(item)_
   * @example
   *  [3, 4, 5].putLast(100); // => [ 3, 4, 100 ]
   *  [].putLast(100); // => []
   */
  sc.register("putLast", {
    Array: function(item) {
      if (this.length > 0) { this[this.length-1] = item; }
      return this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("pyramid", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("pyramidg", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("quantize", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("raddeg", {
    Number: function() {
      return this * 180 / Math.PI;
    },
    Array: function() {
      return this.map(function(x) { return x.raddeg(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("ramp", {
    Number: function() {
      if (this <= 0) { return 0; }
      if (this >= 1) { return 1; }
      return this;
    },
    Array: function() {
      return this.map(function(x) { return x.ramp(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Fill a Array with random values in the range *minVal* to *maxVal*.
   * @arguments _(size [, minVal=0, maxVal=1])_
   * @example
   *  Array.rand(8, 1, 100);
   */
  sc.register("*rand", {
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
   * @returns Random number from zero up to the receiver, exclusive.
   */
  sc.register("rand", {
    Number: function() {
      return Math.random() * this;
    },
    Array: function() {
      return this.map(function(x) { return x.rand(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Fill an Array with random values in the range -*val* to +*val*.
   * @arguments _(size [, val=1])_
   * @example
   *  Array.rand2(8, 100);
   */
  sc.register("*rand2", {
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
  sc.register("rand2", {
    Number: function() {
      return (Math.random() * 2 - 1) * this;
    },
    Array: function() {
      return this.map(function(x) { return x.rand2(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Creates an array of numbers progressing from *start* up to but not including *end*.
   * @arguments _([start=0], end [, step=1])_
   * @example
   *  Array.range(10); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
   *  Array.range(0, 30, 5); // [0, 5, 10, 15, 20, 25]
   */
  sc.register("*range", {
    Array: function(start, end, step) {
      start = +start || 0;
      step  = +step  || 1;
      if (end === void 0) {
        end   = start;
        start = 0;
      }
      var length = Math.max(0, Math.ceil((end - start) / step));
      var index  = -1;
      var result = new Array(length);
      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }
  });

  /**
   * @arguments _(end, step:1)_
   * @example
   *  (10).range(); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
   *  (10).range(30, 5); // [0, 5, 10, 15, 20, 25]
   */
  sc.register("range", {
    Number: function(end, step) {
      if (end === void 0) {
        return Array.series(this, 0, 1);
      }
      step = step === void 0 ? (this < end) ? +1 : -1 : step;
      return Array.range(this, end, step);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("ratiomidi", {
    Number: function() {
      return Math.log(Math.abs(this)) * Math.LOG2E * 12;
    },
    Array: function() {
      return this.map(function(x) { return x.ratiomidi(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * 1 / this
   */
  sc.register("reciprocal", {
    Number: function() {
      return 1 / this;
    },
    Array: function() {
      return this.map(function(x) { return x.reciprocal(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("rectWindow", {
    Number: function() {
      if (this < 0 || this > 1) { return 0; }
      return 1;
    },
    Array: function() {
      return this.map(function(x) { return x.rectWindow(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("reject", {
    Array: function(func) {
      func = sc.func(func);
      return this.filter(function(x, i) { return !func(x, i); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("remove", {
    Array: function(item) {
      var index = this.indexOf(item);
      if (index !== -1) {
        return this.splice(index, 1)[0];
      }
      return null;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("removeAll", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("removeAllSuchThat", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("removeAt", {
    Array: function(index) {
      if (index >= 0) {
        return this.splice(index|0, 1)[0];
      }
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("removeEvery", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("removing", {
    Array: function(item) {
      var a = this.slice();
      a.remove(item);
      return a;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("replace", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("resamp0", {
    Array: function(newSize) {
      var factor = (this.length - 1) / (newSize - 1);
      var a = new Array(newSize);
      for (var i = 0; i < newSize; ++i) {
        a[i] = this[Math.round(i * factor)];
      }
      return a;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("resamp1", {
    Array: function(newSize) {
      var factor = (this.length - 1) / (newSize - 1);
      var a = new Array(newSize);
      for (var i = 0; i < newSize; ++i) {
        a[i] = this.blendAt(i * factor);
      }
      return a;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register(["reverse", "sc_reverse"], {
    Array: function() {
      return this.slice().reverse();
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("reverseDo", {
    Number: function(func) {
      func = sc.func(func);
      var i = this|0, j = 0;
      while (--i >= 0) {
        func(i, j++);
      }
      return this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register(["rightShift", ">>"], {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("ring1", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("ring2", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("ring3", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("ring4", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("rotate", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("round", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("roundUp", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("rrand", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("scaleneg", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register(["scramble", "shuffle"], {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("scurve", {
    Number: function() {
      if (this <= 0) { return 0; }
      if (this >= 1) { return 1; }
      return this * this * (3 - 2 * this);
    },
    Array: function() {
      return this.map(function(x) { return x.scurve(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("sect", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("select", {
    Array: function(func) {
      return this.filter(sc.func(func));
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("separate", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Fill an Array with an arithmetic series.
   * @arguments (size [, start=0, step=1])
   * @example
   *  Array.series(5, 10, 2); // => [ 10, 12, 14, 16, 18 ]
   */
  sc.register("*series", {
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
  sc.register("series", {
    Number: function(second, last) {
      var step = second - this;
      var size = (Math.floor((last - this) / step + 0.001)|0) + 1;
      return Array.series(size, this, step);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("setBit", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Answer -1 if negative, +1 if positive or 0 if zero.
   */
  sc.register("sign", {
    Number: function() {
      return this > 0 ? +1 : this === 0 ? 0 : -1;
    },
    Array: function() {
      return this.map(function(x) { return x.sign(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Sine
   */
  sc.register("sin", {
    Number: function() {
      return Math.sin(this);
    },
    Array: function() {
      return this.map(function(x) { return x.sin(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Hyperbolic sine
   */
  sc.register("sinh", {
    Number: function() {
      return (Math.pow(Math.E, this) - Math.pow(Math.E, -this)) * 0.5;
    },
    Array: function() {
      return this.map(function(x) { return x.sinh(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("size", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("slide", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("softclip", {
    Number: function() {
      var absx = Math.abs(this);
      return absx <= 0.5 ? this : (absx - 0.25) / this;
    },
    Array: function() {
      return this.map(function(x) { return x.softclip(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("sputter", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("sqrdif", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("sqrsum", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * the square root of the number.
   */
  sc.register("sqrt", {
    Number: function() {
      return Math.sqrt(this);
    },
    Array: function() {
      return this.map(function(x) { return x.sqrt(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * the square of the number
   */
  sc.register("squared", {
    Number: function() {
      return this * this;
    },
    Array: function() {
      return this.map(function(x) { return x.squared(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("stutter", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("sum", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("sum3rand", {
    Number: function() {
      return (Math.random() + Math.random() + Math.random() - 1.5) * 0.666666667 * this;
    },
    Array: function() {
      return this.map(function(x) { return x.sum3rand(); });
    }
  });

})(sc);


(function(sc) {
  "use strict";

  sc.register("sumabs", {
    Array: function() {
      var sum = 0, elem;
      for (var i = 0, imax = this.length; i < imax; ++i) {
        elem = Array.isArray(this[i]) ? this[i][0] : this[i];
        sum = sum + Math.abs(elem);
      }
      return sum;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("sumsqr", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Swap two elements in the collection at indices i and j.
   * @arguments _(i, j)_
   * @example
   *  [0,1,2,3,4,5].swap(2, 3); // => [0, 1, 3, 2, 4, 5]
   */
  sc.register("swap", {
    Array: function(i, j) {
      if (0 <= i && i < this.length && 0 <= j && j < this.length) {
        var t = this[i|0];
        this[i|0] = this[j|0];
        this[j|0] = t;
      }
      return this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("symmetricDifference", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("take", {
    Array: function(item) {
      var index = this.indexOf(item);
      if (index !== -1) {
        return this.takeAt(index);
      }
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("takeAt", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("takeThese", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Tangent
   */
  sc.register("tan", {
    Number: function() {
      return Math.tan(this);
    },
    Array: function() {
      return this.map(function(x) { return x.tan(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Hyperbolic tangent
   */
  sc.register("tanh", {
    Number: function() {
      return this.sinh() / this.cosh();
    },
    Array: function() {
      return this.map(function(x) { return x.tanh(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("thresh", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("transposeKey", {
    Array: function(amout, octave) {
      octave = octave === void 0 ? 12 : octave;
      return this.opAdd(amout).opMod(octave).sort();
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("triWindow", {
    Number: function() {
      if (this < 0 || this > 1) { return 0; }
      return (this < 0.5) ? 2 * this : -2 * this + 2;
    },
    Array: function() {
      return this.map(function(x) { return x.triWindow(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("trunc", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("twice", {
    Number: function() {
      return this * 2;
    },
    Array: function() {
      return this.map(function(x) { return x.twice(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("unbubble", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("union", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("uniq", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register(["unsignedRightShift", ">>>"], {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("value", {
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

})(sc);

(function(sc) {
  "use strict";

  var slice = [].slice;

  sc.register("valueArray", {
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
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Choose an element from the collection at random using a list of probabilities or weights. The weights must sum to 1.0.
   * @arguments _(weights)_
   * @example
   *  [1, 2, 3, 4].wchoose([0.1, 0.2, 0.3, 0.4]);
   */
  sc.register("wchoose", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("welWindow", {
    Number: function() {
      if (this < 0 || this > 1) { return 0; }
      return Math.sin(this * Math.PI);
    },
    Array: function() {
      return this.map(function(x) { return x.welWindow(); });
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("*with", {
    Array: function() {
      return Array.apply(null, arguments);
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("wrap", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("wrap2", {
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

})(sc);

(function(sc) {
  "use strict";

  /**
   * Same as `at`, but values for index greater than the size of the ArrayedCollection will be wrapped around to 0.
   * @example
   *  [ 1, 2, 3 ].wrapAt(13); // => 2
   *  [ 1, 2, 3 ].wrapAt([ 0, 1, 2, 3 ]); // => [ 1, 2, 3, 1 ]
   */
  sc.register(["wrapAt", "@@"], {
    Array: function(index) {
      if (Array.isArray(index)) {
        return index.map(function(index) {
          return this.wrapAt(index);
        }, this);
      }
      return this[(index|0).iwrap(0, this.length-1)];
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * Returns a new Array whose elements are repeated sequences of the receiver, up to size length. The receiver is unchanged.
   * @arguments _(size)_
   * @example
   *  [ 1, 2, 3 ].wrapExtend(9); // => [ 1, 2, 3, 1, 2, 3, 1, 2, 3 ]
   */
  sc.register("wrapExtend", {
    Array: function(size) {
      size = Math.max(0, size|0);
      var a = new Array(size);
      for (var i = 0; i < size; ++i) {
        a[i] = this[i % this.length];
      }
      return a;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("wrapPut", {
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

})(sc);

(function(sc) {
  "use strict";

  sc.register("wrapSwap", {
    Array: function(i, j) {
      i = (i|0).iwrap(0, this.length-1);
      j = (j|0).iwrap(0, this.length-1);
      var t = this[i];
      this[i] = this[j];
      this[j] = t;
      return this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  sc.register("xrand", {
    Number: function(exclude) {
      exclude = exclude === void 0 ? 0 : exclude;
      return (exclude + (this - 1).rand() + 1) % this;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  /**
   * @arguments exclude	an Integer.
   * @returns a random value from this.neg to this, excluding the value exclude.
   */
  sc.register("xrand2", {
    Number: function(exclude) {
      exclude = exclude === void 0 ? 0 : exclude;
      var res = (2 * this).rand() - this;
      return (res === exclude) ? this : res;
    }
  });

})(sc);

(function(sc) {
  "use strict";

  function Tuning(tuning, octaveRatio, name) {
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

  // ## semitones ()
  // Returns an array of semitone values for the pitch set
  Tuning.prototype.semitones = function() {
    return this._tuning.slice(0);
  };
  // ## cents ()
  // Returns a array of cent values for the pitch set
  Tuning.prototype.cents = function() {
    return this._tuning.slice(0).map(function(x) {
      return x * 100;
    });
  };
  // ## ratios ()
  // Returns a tuned array of ratios for the pitch set
  Tuning.prototype.ratios = function() {
    return this._tuning.midiratio();
  };
  // ## at (index:int)
  Tuning.prototype.at = function(index) {
    return this._tuning[index|0];
  };
  // ## wrapAt (index:int)
  Tuning.prototype.wrapAt = function(index) {
    return this._tuning.wrapAt(index|0);
  };
  // ## octaveRatio ()
  Tuning.prototype.octaveRatio = function() {
    return this._octaveRatio;
  };
  // ## size ()
  Tuning.prototype.size = function() {
    return this._tuning.length;
  };
  // ## stepsPerOctave ()
  Tuning.prototype.stepsPerOctave = function() {
    return Math.log(this._octaveRatio) * Math.LOG2E * 12;
  };
  // ## tuning ()
  Tuning.prototype.tuning = function() {
    return this._tuning;
  };
  // ## equals (argTuning)
  Tuning.prototype.equals = function(argTuning) {
    return this._octaveRatio === argTuning._octaveRatio &&
      this._tuning.equals(argTuning._tuning);
  };
  // ## deepCopy ()
  Tuning.prototype.deepCopy = function() {
    return new Tuning(this._tuning.slice(0),
                      this._octaveRatio,
                      this.name);
  };

  // ## Tuning.et (pitchesPerOctave:12)
  // Creates an equal-tempered scale based on pitchesPerOctave
  Tuning.et = function(pitchesPerOctave) {
    if (typeof pitchesPerOctave !== "number") {
      pitchesPerOctave = 12;
    }
    return new Tuning(Tuning.calcET(pitchesPerOctave),
                      2,
                      Tuning.etName(pitchesPerOctave));
  };
  // ## Tuning.choose (size:12)
  // Creates a random tuning from the library, constrained by size (which defaults to 12)
  Tuning.choose = function(size) {
    if (typeof size !== "number") {
      size = 12;
    }
    return TuningInfo.choose(
      function(x) { return x.size() === size; }
    );
  };
  // ## Tuning.default (pitchesPerOctave)
  Tuning["default"] = function(pitchesPerOctave) {
    return Tuning.et(pitchesPerOctave);
  };
  // ## Tuning.calcET (pitchesPerOctave)
  Tuning.calcET = function(pitchesPerOctave) {
    var a = new Array(pitchesPerOctave);
    for (var i = a.length; i--; ) {
      a[i] = i * (12 / pitchesPerOctave);
    }
    return a;
  };
  // ## Tuning.etName (pitchesPerOctave)
  Tuning.etName = function(pitchesPerOctave) {
    return "ET" + pitchesPerOctave;
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
    "et12", new Tuning(([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
    ]), 2, "ET12")
  );
  TuningInfo.register(
    "just", new Tuning([
      1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8
    ].ratiomidi(), 2, "Limit Just Intonation")
  );
  // ### TWELVE-TONE TUNINGS
  sc.TuningInfo.register(
    "pythagorean",
    new Tuning([ 1, 256/243, 9/8, 32/27, 81/64, 4/3, 729/512, 3/2, 128/81, 27/16, 16/9, 243/128 ].ratiomidi(), 2, "Pythagorean")
  );

  sc.TuningInfo.register(
    "sept1",
    new Tuning([ 1, 16/15, 9/8, 6/5, 5/4, 4/3, 7/5, 3/2, 8/5, 5/3, 9/5, 15/8 ].ratiomidi(), 2, "Septimal Tritone Just Intonation")
  );

  sc.TuningInfo.register(
    "sept2",
    new Tuning([ 1, 16/15, 9/8, 6/5, 5/4, 4/3, 7/5, 3/2, 8/5, 5/3, 7/4, 15/8 ].ratiomidi(), 2, "7-Limit Just Intonation")
  );

  sc.TuningInfo.register(
    "mean4",
    new Tuning([ 0, 0.755, 1.93, 3.105, 3.86, 5.035, 5.79, 6.965, 7.72, 8.895, 10.07, 10.82 ], 2, "Meantone, 1/4 Syntonic Comma")
  );

  sc.TuningInfo.register(
    "mean5",
    new Tuning([ 0, 0.804, 1.944, 3.084, 3.888, 5.028, 5.832, 6.972, 7.776, 8.916, 10.056, 10.86 ], 2, "Meantone, 1/5 Pythagorean Comma")
  );

  sc.TuningInfo.register(
    "mean6",
    new Tuning([ 0, 0.86, 1.96, 3.06, 3.92, 5.02, 5.88, 6.98, 7.84, 8.94, 10.04, 10.9 ], 2, "Meantone, 1/6 Pythagorean Comma")
  );

  sc.TuningInfo.register(
    "kirnberger",
    new Tuning([ 1, 256/243, Math.sqrt(5)/2, 32/27, 5/4, 4/3, 45/32, Math.pow(5, 0.25), 128/81, Math.pow(5, 0.75)/2, 16/9, 15/8 ].ratiomidi(), 2, "Kirnberger III")
  );

  sc.TuningInfo.register(
    "werckmeister",
    new Tuning([ 0, 0.92, 1.93, 2.94, 3.915, 4.98, 5.9, 6.965, 7.93, 8.895, 9.96, 10.935 ], 2, "Werckmeister III")
  );

  sc.TuningInfo.register(
    "vallotti",
    new Tuning([ 0, 0.94135, 1.9609, 2.98045, 3.92180, 5.01955, 5.9218, 6.98045, 7.9609, 8.94135, 10, 10.90225 ], 2, "Vallotti")
  );

  sc.TuningInfo.register(
    "young",
    new Tuning([ 0, 0.9, 1.96, 2.94, 3.92, 4.98, 5.88, 6.98, 7.92, 8.94, 9.96, 10.9 ], 2, "Young")
  );

  sc.TuningInfo.register(
    "reinhard",
    new Tuning([ 1, 14/13, 13/12, 16/13, 13/10, 18/13, 13/9, 20/13, 13/8, 22/13, 13/7, 208/105 ].ratiomidi(), 2, "Mayumi Reinhard")
  );

  sc.TuningInfo.register(
    "wcHarm",
    new Tuning([ 1, 17/16, 9/8, 19/16, 5/4, 21/16, 11/8, 3/2, 13/8, 27/16, 7/4, 15/8 ].ratiomidi(), 2, "Wendy Carlos Harmonic")
  );

  sc.TuningInfo.register(
    "wcSJ",
    new Tuning([ 1, 17/16, 9/8, 6/5, 5/4, 4/3, 11/8, 3/2, 13/8, 5/3, 7/4, 15/8 ].ratiomidi(), 2, "Wendy Carlos Super Just")
  );

  // ### MORE THAN TWELVE-TONE ET
  sc.TuningInfo.register(
    "et19",
    new Tuning(Array.range(0, 19).opMul(12/19), 2, "ET19")
  );

  sc.TuningInfo.register(
    "et22",
    new Tuning(Array.range(0, 22).opMul(12/22), 2, "ET22")
  );

  sc.TuningInfo.register(
    "et24",
    new Tuning(Array.range(0, 24).opMul(12/24), 2, "ET24")
  );

  sc.TuningInfo.register(
    "et31",
    new Tuning(Array.range(0, 31).opMul(12/31), 2, "ET31")
  );

  sc.TuningInfo.register(
    "et41",
    new Tuning(Array.range(0, 41).opMul(12/41), 2, "ET41")
  );
  sc.TuningInfo.register(
    "et53",
    new Tuning(Array.range(0, 53).opMul(12/53), 2, "ET53")
  );
  // ### NON-TWELVE-TONE JI
  sc.TuningInfo.register(
    "johnston",
    new Tuning([ 1, 25/24, 135/128, 16/15, 10/9, 9/8, 75/64, 6/5, 5/4, 81/64, 32/25, 4/3, 27/20, 45/32, 36/25, 3/2, 25/16, 8/5, 5/3, 27/16, 225/128, 16/9, 9/5, 15/8, 48/25 ].ratiomidi(), 2, "Ben Johnston")
  );
  sc.TuningInfo.register(
    "partch",
    new Tuning([ 1, 81/80, 33/32, 21/20, 16/15, 12/11, 11/10, 10/9, 9/8, 8/7, 7/6, 32/27, 6/5, 11/9, 5/4, 14/11, 9/7, 21/16, 4/3, 27/20, 11/8, 7/5, 10/7, 16/11, 40/27, 3/2, 32/21, 14/9, 11/7, 8/5, 18/11, 5/3, 27/16, 12/7, 7/4, 16/9, 9/5, 20/11, 11/6, 15/8, 40/21, 64/33, 160/81 ].ratiomidi(), 2, "Harry Partch")
  );
  sc.TuningInfo.register(
    "catler",
    new Tuning([ 1, 33/32, 16/15, 9/8, 8/7, 7/6, 6/5, 128/105, 16/13, 5/4, 21/16, 4/3, 11/8, 45/32, 16/11, 3/2, 8/5, 13/8, 5/3, 27/16, 7/4, 16/9, 24/13, 15/8 ].ratiomidi(), 2, "Jon Catler")
  );
  sc.TuningInfo.register(
    "chalmers",
    new Tuning([ 1, 21/20, 16/15, 9/8, 7/6, 6/5, 5/4, 21/16, 4/3, 7/5, 35/24, 3/2, 63/40, 8/5, 5/3, 7/4, 9/5, 28/15, 63/32 ].ratiomidi(), 2, "John Chalmers")
  );
  sc.TuningInfo.register(
    "harrison",
    new Tuning([ 1, 16/15, 10/9, 8/7, 7/6, 6/5, 5/4, 4/3, 17/12, 3/2, 8/5, 5/3, 12/7, 7/4, 9/5, 15/8 ].ratiomidi(), 2, "Lou Harrison")
  );
  sc.TuningInfo.register(
    "sruti",
    new Tuning([ 1, 256/243, 16/15, 10/9, 9/8, 32/27, 6/5, 5/4, 81/64, 4/3, 27/20, 45/32, 729/512, 3/2, 128/81, 8/5, 5/3, 27/16, 16/9, 9/5, 15/8, 243/128 ].ratiomidi(), 2, "Sruti")
  );
  // ### HARMONIC SERIES -- length arbitary
  sc.TuningInfo.register(
    "harmonic",
    new Tuning(Array.range(1,25).ratiomidi(), 2, "Harmonic Series 24")
  );
  // ### STRETCHED/SHRUNK OCTAVE
  // ### Bohlen-Pierce
  sc.TuningInfo.register(
    "bp",
    new Tuning(Array.range(13).opMul((3).ratiomidi() / 13), 3.0, "Bohlen-Pierce")
  );
  sc.TuningInfo.register(
    "wcAlpha",
    new Tuning(Array.range(15).opMul(0.78), (15 * 0.78).midiratio(), "Wendy Carlos Alpha")
  );
  sc.TuningInfo.register(
    "wcBeta",
    new Tuning(Array.range(19).opMul(0.638), (19 * 0.638).midiratio(), "Wendy Carlos Beta")
  );
  sc.TuningInfo.register(
    "wcGamma",
    new Tuning(Array.range(34).opMul(0.351), (34 * 0.351).midiratio(), "Wendy Carlos Gamma")
  );

  sc.Tuning = Tuning;

})(sc);

(function(sc) {
  "use strict";

  function Scale(degrees, pitchesPerOctave, tuning, name) {
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

  // ## tuning (inTuning:Tuning)
  // Sets or gets the tuning of the Scale.
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
  // ## semitones ()
  // Returns a tuned array of semitone values
  Scale.prototype.semitones = function() {
    return this._degrees.map(this._tuning.wrapAt.bind(this._tuning));
  };
  // ## cents ()
  // Returns a turned array of cent values
  Scale.prototype.cents = function() {
    return this.semitones().map(function(x) {
      return x * 100;
    });
  };
  // ## ratios ()
  // Return a turned array of ratios
  Scale.prototype.ratios = function() {
    return this._ratios;
  };
  // ## size ()
  // Returns the length of the scale
  Scale.prototype.size = function() {
    return this._degrees.length;
  };
  // ## pitchesPerOctave ()
  // Returns the size of the pitch class set from which the tuning is drawn
  Scale.prototype.pitchesPerOctave = function() {
    return this._pitchesPerOctave;
  };
  // ## stepsPerOctave ()
  // Usually 12, but may be different if the current tuning has a stretched or compressed octave. Needed for degreeToKey
  Scale.prototype.stepsPerOctave = function() {
    return Math.log(this.octaveRatio()) * Math.LOG2E * 12;
  };
  // ## at (index:int)
  Scale.prototype.at = function(index) {
    return this._tuning.at(this._degrees.wrapAt(index));
  };
  // ## wrapAt (index:int)
  Scale.prototype.wrapAt = function(index) {
    return this._tuning.wrapAt(this._degrees.wrapAt(index));
  };
  // ## degreeToFreq (degree, rootFreq, octave)
  Scale.prototype.degreeToFreq = function(degree, rootFreq, octave) {
    return this.degreeToRatio(degree, octave) * rootFreq;
  };
  // ## degreeToRatio (degree, octave=0)
  Scale.prototype.degreeToRatio = function(degree, octave) {
    if (typeof octave !== "number") { octave = 0; }
    octave += (degree / this._degrees.length)|0;
    return this.ratios().wrapAt(degree) * Math.pow(this.octaveRatio(), octave);
  };
  // ## checkTuningForMismatch (aTuning)
  Scale.prototype.checkTuningForMismatch = function(aTuning) {
    return this._pitchesPerOctave === aTuning.size();
  };
  // ## degrees ()
  Scale.prototype.degrees = function() {
    return this._degrees;
  };
  // ## guessPPO ()
  Scale.prototype.guessPPO = function() {
    return Scale.guessPPO(this._degrees);
  };
  // ## octaveRatio ()
  Scale.prototype.octaveRatio = function() {
    return this._tuning.octaveRatio();
  };
  // ## performDegreeToKey (scaleDegree, stepsPerOctave, accidental=0)
  Scale.prototype.performDegreeToKey = function(scaleDegree, stepsPerOctave, accidental) {
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
  // ## performKeyToDegree (degree, stepsPerOctave=12)
  Scale.prototype.performKeyToDegree = function(degree, stepsPerOctave) {
    if (typeof stepsPerOctave !== "number") { stepsPerOctave = 12; }
    return this._degrees.performKeyToDegree(degree, stepsPerOctave);
  };
  // ## performNearestInList (degree)
  Scale.prototype.performNearestInList = function(degree) {
    return this._degrees.performNearestInList(degree);
  };
  // ## performNearestInScale (degree, stepsPerOctave=12)
  Scale.prototype.performNearestInScale = function(degree, stepsPerOctave) {
    if (typeof stepsPerOctave !== "number") { stepsPerOctave = 12; }
    return this._degrees.performNearestInScale(degree, stepsPerOctave);
  };
  // ## equals (argScale)
  Scale.prototype.equals = function(argScale) {
    return this.degrees().equals(argScale.degrees()) && this._tuning.equals(argScale._tuning);
  };
  // ## deepCopy ()
  Scale.prototype.deepCopy = function() {
    return new Scale(this._degrees.slice(),
                     this._pitchesPerOctave,
                     this._tuning.deepCopy(),
                     this.name);
  };

  // ## Scale.choose (size=7, pitchesPerOctave=12)
  // Creates a random scale from the library, constrained by size and pitchesPerOctave if desired
  Scale.choose = function(size, pitchesPerOctave) {
    if (typeof size !== "number") { size = 7; }
    if (typeof pitchesPerOctave !== "number") { pitchesPerOctave = 12; }
    return ScaleInfo.choose(function(x) {
      return x._degrees.length === size &&
        x._pitchesPerOctave === pitchesPerOctave;
    });
  };
  // ## Scale.guessPPO (degrees:Array)
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
    "major", new Scale([0,2,4,5,7,9,11], 12, null, "Major")
  );
  ScaleInfo.register(
    "minor", new Scale([0,2,3,5,7,8,10], 12, null, "Natural Minor")
  );
  // ### TWELVE-TONES PER OCTAVE

  // ### 5 note scales
  sc.ScaleInfo.register(
    "minorPentatonic",
    new Scale([0,3,5,7,10], 12, "Minor Pentatonic")
  );
  sc.ScaleInfo.register(
    "majorPentatonic",
    new Scale([0,2,4,7,9], 12, "Major Pentatonic")
  );
  // ### another mode of major pentatonic
  sc.ScaleInfo.register(
    "ritusen",
    new Scale([0,2,5,7,9], 12, "Ritusen")
  );
  // ### another mode of major pentatonic
  sc.ScaleInfo.register(
    "egyptian",
    new Scale([0,2,5,7,10], 12, "Egyptian")
  );
  sc.ScaleInfo.register(
	"kumoi",
    new Scale([0,2,3,7,9], 12, "Kumoi")
  );
  sc.ScaleInfo.register(
	"hirajoshi",
    new Scale([0,2,3,7,8], 12, "Hirajoshi")
  );
  sc.ScaleInfo.register(
	"iwato",
    new Scale([0,1,5,6,10], 12, "Iwato")
  );
  sc.ScaleInfo.register(
	"chinese",
    new Scale([0,4,6,7,11], 12, "Chinese")
  );
  sc.ScaleInfo.register(
	"indian",
    new Scale([0,4,5,7,10], 12, "Indian")
  );
  sc.ScaleInfo.register(
	"pelog",
    new Scale([0,1,3,7,8], 12, "Pelog")
  );
  sc.ScaleInfo.register(
	"prometheus",
    new Scale([0,2,4,6,11], 12, "Prometheus")
  );
  sc.ScaleInfo.register(
	"scriabin",
    new Scale([0,1,4,7,9], 12, "Scriabin")
  );
  // ### han chinese pentatonic scales
  sc.ScaleInfo.register(
	"gong",
    new Scale([0,2,4,7,9], 12, "Gong")
  );
  sc.ScaleInfo.register(
	"shang",
    new Scale([0,2,5,7,10], 12, "Shang")
  );
  sc.ScaleInfo.register(
    "jiao",
    new Scale([0,3,5,8,10], 12, "Jiao")
  );
  sc.ScaleInfo.register(
    "zhi",
    new Scale([0,2,5,7,9], 12, "Zhi")
  );
  sc.ScaleInfo.register(
    "yu",
    new Scale([0,3,5,7,10], 12, "Yu")
  );
  // ### 6 note scales
  sc.ScaleInfo.register(
    "whole",
    new Scale([0,2,4,6,8,10], 12, "Whole Tone")
  );
  sc.ScaleInfo.register(
	"augmented",
    new Scale([0,3,4,7,8,11], 12, "Augmented")
  );
  sc.ScaleInfo.register(
	"augmented2",
    new Scale([0,1,4,5,8,9], 12, "Augmented 2")
  );
  // ### Partch's Otonalities and Utonalities
  sc.ScaleInfo.register(
    "partch_o1",
    new Scale([0,8,14,20,25,34], 43, "partch", "Partch Otonality 1")
  );
  sc.ScaleInfo.register(
	"partch_o2",
    new Scale([0,7,13,18,27,35], 43, "partch", "Partch Otonality 2")
  );
  sc.ScaleInfo.register(
    "partch_o3",
    new Scale([0,6,12,21,29,36], 43, "partch", "Partch Otonality 3")
  );
  sc.ScaleInfo.register(
    "partch_o4",
    new Scale([0,5,15,23,30,37], 43, "partch", "Partch Otonality 4")
  );
  sc.ScaleInfo.register(
    "partch_o5",
    new Scale([0,10,18,25,31,38], 43, "partch", "Partch Otonality 5")
  );
  sc.ScaleInfo.register(
    "partch_o6",
    new Scale([0,9,16,22,28,33], 43, "partch", "Partch Otonality 6")
  );
  sc.ScaleInfo.register(
    "partch_u1",
    new Scale([0,9,18,23,29,35], 43, "partch", "Partch Utonality 1")
  );
  sc.ScaleInfo.register(
    "partch_u2",
    new Scale([0,8,16,25,30,36], 43, "partch", "Partch Utonality 2")
  );
  sc.ScaleInfo.register(
    "partch_u3",
    new Scale([0,7,14,22,31,37], 43, "partch", "Partch Utonality 3")
  );
  sc.ScaleInfo.register(
    "partch_u4",
    new Scale([0,6,13,20,28,38], 43, "partch", "Partch Utonality 4")
  );
  sc.ScaleInfo.register(
    "partch_u5",
    new Scale([0,5,12,18,25,33], 43, "partch", "Partch Utonality 5")
  );
  sc.ScaleInfo.register(
    "partch_u6",
    new Scale([0,10,15,21,27,34], 43, "partch", "Partch Utonality 6")
  );
  // ### hexatonic modes with no tritone
  sc.ScaleInfo.register(
	"hexMajor7",
    new Scale([0,2,4,7,9,11], 12, "Hex Major 7")
  );
  sc.ScaleInfo.register(
    "hexDorian",
    new Scale([0,2,3,5,7,10], 12, "Hex Dorian")
  );
  sc.ScaleInfo.register(
    "hexPhrygian",
    new Scale([0,1,3,5,8,10], 12, "Hex Phrygian")
  );
  sc.ScaleInfo.register(
    "hexSus",
    new Scale([0,2,5,7,9,10], 12, "Hex Sus")
  );
  sc.ScaleInfo.register(
    "hexMajor6",
    new Scale([0,2,4,5,7,9], 12, "Hex Major 6")
  );
  sc.ScaleInfo.register(
    "hexAeolian",
    new Scale([0,3,5,7,8,10], 12, "Hex Aeolian")
  );
  // ### 7 note scales
  sc.ScaleInfo.register(
	"ionian",
    new Scale([0,2,4,5,7,9,11], 12, "Ionian")
  );
  sc.ScaleInfo.register(
	"dorian",
    new Scale([0,2,3,5,7,9,10], 12, "Dorian")
  );
  sc.ScaleInfo.register(
	"phrygian",
    new Scale([0,1,3,5,7,8,10], 12, "Phrygian")
  );
  sc.ScaleInfo.register(
	"lydian",
    new Scale([0,2,4,6,7,9,11], 12, "Lydian")
  );
  sc.ScaleInfo.register(
	"mixolydian",
    new Scale([0,2,4,5,7,9,10], 12, "Mixolydian")
  );
  sc.ScaleInfo.register(
	"aeolian",
    new Scale([0,2,3,5,7,8,10], 12, "Aeolian")
  );
  sc.ScaleInfo.register(
    "locrian",
    new Scale([0,1,3,5,6,8,10], 12, "Locrian")
  );
  sc.ScaleInfo.register(
	"harmonicMinor",
    new Scale([0,2,3,5,7,8,11], 12, "Harmonic Minor")
  );
  sc.ScaleInfo.register(
	"harmonicMajor",
    new Scale([0,2,4,5,7,8,11], 12, "Harmonic Major")
  );
  sc.ScaleInfo.register(
	"melodicMinor",
    new Scale([0,2,3,5,7,9,11], 12, "Melodic Minor")
  );
  sc.ScaleInfo.register(
    "melodicMinorDesc",
    new Scale([0,2,3,5,7,8,10], 12, "Melodic Minor Descending")
  );
  sc.ScaleInfo.register(
    "melodicMajor",
    new Scale([0,2,4,5,7,8,10], 12, "Melodic Major")
  );
  sc.ScaleInfo.register(
	"bartok",
    new Scale([0,2,4,5,7,8,10], 12, "Bartok")
  );
  sc.ScaleInfo.register(
	"hindu",
    new Scale([0,2,4,5,7,8,10], 12, "Hindu")
  );
  // ### raga modes
  sc.ScaleInfo.register(
    "todi",
    new Scale([0,1,3,6,7,8,11], 12, "Todi")
  );
  sc.ScaleInfo.register(
    "purvi",
    new Scale([0,1,4,6,7,8,11], 12, "Purvi")
  );
  sc.ScaleInfo.register(
    "marva",
    new Scale([0,1,4,6,7,9,11], 12, "Marva")
  );
  sc.ScaleInfo.register(
    "bhairav",
    new Scale([0,1,4,5,7,8,11], 12, "Bhairav")
  );
  sc.ScaleInfo.register(
    "ahirbhairav",
    new Scale([0,1,4,5,7,9,10], 12, "Ahirbhairav")
  );
  sc.ScaleInfo.register(
	"superLocrian",
    new Scale([0,1,3,4,6,8,10], 12, "Super Locrian")
  );
  sc.ScaleInfo.register(
    "romanianMinor",
    new Scale([0,2,3,6,7,9,10], 12, "Romanian Minor")
  );
  sc.ScaleInfo.register(
    "hungarianMinor",
    new Scale([0,2,3,6,7,8,11], 12, "Hungarian Minor")
  );
  sc.ScaleInfo.register(
    "neapolitanMinor",
    new Scale([0,1,3,5,7,8,11], 12, "Neapolitan Minor")
  );
  sc.ScaleInfo.register(
    "enigmatic",
    new Scale([0,1,4,6,8,10,11], 12, "Enigmatic")
  );
  sc.ScaleInfo.register(
    "spanish",
    new Scale([0,1,4,5,7,8,10], 12, "Spanish")
  );
  // ### modes of whole tones with added note ->
  sc.ScaleInfo.register(
	"leadingWhole",
    new Scale([0,2,4,6,8,10,11], 12, "Leading Whole Tone")
  );
  sc.ScaleInfo.register(
    "lydianMinor",
    new Scale([0,2,4,6,7,8,10], 12, "Lydian Minor")
  );
  sc.ScaleInfo.register(
    "neapolitanMajor",
    new Scale([0,1,3,5,7,9,11], 12, "Neapolitan Major")
  );
  sc.ScaleInfo.register(
    "locrianMajor",
    new Scale([0,2,4,5,6,8,10], 12, "Locrian Major")
  );
  // ### 8 note scales
  sc.ScaleInfo.register(
    "diminished",
    new Scale([0,1,3,4,6,7,9,10], 12, "Diminished")
  );
  sc.ScaleInfo.register(
    "diminished2",
    new Scale([0,2,3,5,6,8,9,11], 12, "Diminished 2")
  );
  // ### 12 note scales
  sc.ScaleInfo.register(
    "chromatic",
    new Scale([0,1,2,3,4,5,6,7,8,9,10,11], 12, "Chromatic")
  );
  // ### TWENTY-FOUR TONES PER OCTAVE
  sc.ScaleInfo.register(
    "chromatic24",
    new Scale([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], 24, "Chromatic 24")
  );
  // ### maqam ajam
  sc.ScaleInfo.register(
    "ajam",
    new Scale([0,4,8,10,14,18,22], 24, "Ajam")
  );
  sc.ScaleInfo.register(
    "jiharkah",
    new Scale([0,4,8,10,14,18,21], 24, "Jiharkah")
  );
  sc.ScaleInfo.register(
    "shawqAfza",
    new Scale([0,4,8,10,14,16,22], 24, "Shawq Afza")
  );
  // ### maqam sikah
  sc.ScaleInfo.register(
    "sikah",
    new Scale([0,3,7,11,14,17,21], 24, "Sikah")
  );
  sc.ScaleInfo.register(
    "sikahDesc",
    new Scale([0,3,7,11,13,17,21], 24, "Sikah Descending")
  );
  sc.ScaleInfo.register(
    "huzam",
    new Scale([0,3,7,9,15,17,21], 24, "Huzam")
  );
  sc.ScaleInfo.register(
    "iraq",
    new Scale([0,3,7,10,13,17,21], 24, "Iraq")
  );
  sc.ScaleInfo.register(
    "bastanikar",
    new Scale([0,3,7,10,13,15,21], 24, "Bastanikar")
  );
  sc.ScaleInfo.register(
    "mustar",
    new Scale([0,5,7,11,13,17,21], 24, "Mustar")
  );
  // ### maqam bayati
  sc.ScaleInfo.register(
    "bayati",
    new Scale([0,3,6,10,14,16,20], 24, "Bayati")
  );
  sc.ScaleInfo.register(
    "karjighar",
    new Scale([0,3,6,10,12,18,20], 24, "Karjighar")
  );
  sc.ScaleInfo.register(
    "husseini",
    new Scale([0,3,6,10,14,17,21], 24, "Husseini")
  );
  // ### maqam nahawand
  sc.ScaleInfo.register(
    "nahawand",
    new Scale([0,4,6,10,14,16,22], 24, "Nahawand")
  );
  sc.ScaleInfo.register(
    "nahawandDesc",
    new Scale([0,4,6,10,14,16,20], 24, "Nahawand Descending")
  );
  sc.ScaleInfo.register(
    "farahfaza",
    new Scale([0,4,6,10,14,16,20], 24, "Farahfaza")
  );
  sc.ScaleInfo.register(
    "murassah",
    new Scale([0,4,6,10,12,18,20], 24, "Murassah")
  );
  sc.ScaleInfo.register(
    "ushaqMashri",
    new Scale([0,4,6,10,14,17,21], 24, "Ushaq Mashri")
  );
  // ### maqam rast
  sc.ScaleInfo.register(
    "rast",
    new Scale([0,4,7,10,14,18,21], 24, "Rast")
  );
  sc.ScaleInfo.register(
    "rastDesc",
    new Scale([0,4,7,10,14,18,20], 24, "Rast Descending")
  );
  sc.ScaleInfo.register(
    "suznak",
    new Scale([0,4,7,10,14,16,22], 24, "Suznak")
  );
  sc.ScaleInfo.register(
    "nairuz",
    new Scale([0,4,7,10,14,17,20], 24, "Nairuz")
  );
  sc.ScaleInfo.register(
    "yakah",
    new Scale([0,4,7,10,14,18,21], 24, "Yakah")
  );
  sc.ScaleInfo.register(
    "yakahDesc",
    new Scale([0,4,7,10,14,18,20], 24, "Yakah Descending")
  );
  sc.ScaleInfo.register(
    "mahur",
    new Scale([0,4,7,10,14,18,22], 24, "Mahur")
  );
  // ### maqam hijaz
  sc.ScaleInfo.register(
    "hijaz",
    new Scale([0,2,8,10,14,17,20], 24, "Hijaz")
  );
  sc.ScaleInfo.register(
    "hijazDesc",
    new Scale([0,2,8,10,14,16,20], 24, "Hijaz Descending")
  );
  sc.ScaleInfo.register(
    "zanjaran",
    new Scale([0,2,8,10,14,18,20], 24, "Zanjaran")
  );
  // ### maqam saba
  sc.ScaleInfo.register(
	"saba",
    new Scale([0,3,6,8,12,16,20], 24, "Saba")
  );
  sc.ScaleInfo.register(
    "zamzam",
    new Scale([0,2,6,8,14,16,20], 24, "Zamzam")
  );
  // ### maqam kurd
  sc.ScaleInfo.register(
    "kurd",
    new Scale([0,2,6,10,14,16,20], 24, "Kurd")
  );
  sc.ScaleInfo.register(
    "kijazKarKurd",
    new Scale([0,2,8,10,14,16,22], 24, "Kijaz Kar Kurd")
  );
  // ### maqam nawa Athar
  sc.ScaleInfo.register(
    "nawaAthar",
    new Scale([0,4,6,12,14,16,22], 24, "Nawa Athar")
  );
  sc.ScaleInfo.register(
    "nikriz",
    new Scale([0,4,6,12,14,18,20], 24, "Nikriz")
  );
  sc.ScaleInfo.register(
    "atharKurd",
    new Scale([0,2,6,12,14,16,22], 24, "Athar Kurd")
  );

  sc.Scale = Scale;

})(sc);
