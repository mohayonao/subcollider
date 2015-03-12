"use strict";

/// # sc
/// SubCollider is a JavaScript library that provides like SuperCollider functions to the **sc** namespace.
/// ```js
/// sc.midicps(69); // => 440
/// sc.wrapAt([ 0, 1, 2, 3 ], 10); // => 2
/// ```
/// ## MultiChannel Arguments
/// ```js
/// sc.midicps([ 69, 71 ]) // => [ 440, 493.8833012561241 ]
/// sc.wrapAt([ 0, 1, 2, 3 ], [ 10, 20 ]) // => [ 2, 0 ]
/// ```
/// ## Method Chain
/// ```js
/// sc(60).midicps().value(); // => 440
/// sc([ 69, 71 ]).midicps().value(); // => [ 440, 493.8833012561241 ]
/// ```
class SC {
  constructor(value) {
    this._value = value;
  }

  value() {
    return this._value;
  }
}

function peel(value) {
  return value instanceof SC ? value.value() : value;
}

function flop(array) {
  if (array.length === 0) {
    return [ [] ];
  }

  let maxSize = array.reduce((len, sublist) => {
    return Math.max(len, Array.isArray(sublist) ? sublist.length : 1);
  }, 0);
  let result = new Array(maxSize);
  let len = array.length;

  for (let i = 0; i < maxSize; i++) {
    let sublist = result[i] = new Array(len);
    for (let j = 0; j < len; j++) {
      let value = array[j];
      sublist[j] = Array.isArray(value) ? value[i % value.length] : value;
    }
  }

  return result;
}

function defineMethod(target, name, func) {
  Object.defineProperty(target.prototype, name, {
    value: func,
    enumerable: false,
    configurable: true,
    writable: true
  });
}

function sc(value) {
  return new SC(value);
}

function value(func, name, that, args, expandToArray) {
  let hasArray = args.some(Array.isArray);

  if (hasArray) {
    args = flop(args);

    if (expandToArray && Array.isArray(that._value)) {
      let value = new Array(Math.max(that._value.length, args.length));
      for (let i = 0; i < value.length; i++) {
        let that = new SC(that._value[i % that._value.length]);
        value[i] = peel(that[name].apply(that, args[i % args.length]));
      }
      return value;
    }

    return args.map(args => peel(that[name].apply(that, args)));
  }

  args = args.map(peel);

  if (expandToArray && Array.isArray(that._value)) {
    return that._value.map((value) => {
      return func.apply(null, [ value ].concat(args));
    });
  }

  return func.apply(null, [ that._value ].concat(args));
}

function addFunction(name, func, opts = {}) {
  if (sc.hasOwnProperty(name) && !opts.override) {
    return;
  }

  sc[name] = function(value) {
    let args = Array.prototype.slice.call(arguments, 1);

    return SC.prototype[name].apply(new SC(value), args).value();
  };

  let expandToArray = !!opts.expandToArray;

  defineMethod(SC, name, function() {
    let args = Array.prototype.slice.call(arguments, 0, func.length);

    return new SC(value(func, name, this, args, expandToArray));
  });
}

function removeFunction(name) {
  delete sc[name];
  delete SC.prototype[name];
}

function mixin(source, opts = {}) {
  Object.keys(source || 0).forEach(name => {
    if (typeof source[name] === "function") {
      addFunction(name, source[name], opts);
    }
  });
  return sc;
}

sc.addFunction = addFunction;
sc.removeFunction = removeFunction;
sc.mixin = mixin;

export default sc;
