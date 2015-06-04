export class SC {
  constructor(value) {
    this._value = value;
  }

  value() {
    return this._value;
  }
}

export function peel(value) {
  return value instanceof SC ? value.value() : value;
}

export function flop(array) {
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

export function defineMethod(target, name, func) {
  Object.defineProperty(target.prototype, name, {
    value: func,
    enumerable: false,
    configurable: true,
    writable: true,
  });
}

function sc(value) {
  return new SC(value);
}

function valueOf(func, value, args, expandToArray) {
  let hasArray = args.some(Array.isArray);

  if (hasArray) {
    args = flop(args);

    if (expandToArray && Array.isArray(value)) {
      let result = new Array(Math.max(value.length, args.length));

      for (let i = 0; i < result.length; i++) {
        result[i] = valueOf(func, value[i % value.length], args[i % args.length], expandToArray);
      }
      return result;
    }

    return args.map(args => valueOf(func, value, args, expandToArray));
  }

  args = args.map(peel);

  if (expandToArray && Array.isArray(value)) {
    return value.map(value => valueOf(func, value, args, expandToArray));
  }

  return func.apply(null, [ value ].concat(args));
}

let funcNameToCategory = {};

function addFunction(name, func, opts = {}) {
  if (sc.hasOwnProperty(name) && !opts.override) {
    return;
  }

  let expandToArray = !!opts.expandToArray;

  sc[name] = function(value) {
    let args = Array.prototype.slice.call(arguments, 1, func.length);

    return valueOf(func, value, args, expandToArray);
  };

  defineMethod(SC, name, function() {
    let args = Array.prototype.slice.call(arguments, 0, func.length - 1);

    return new SC(valueOf(func, this.value(), args, expandToArray));
  });

  if (typeof opts.category === "string") {
    if (!sc.hasOwnProperty(opts.category)) {
      sc[opts.category] = {};
    }

    sc[opts.category][name] = func;

    if (funcNameToCategory.hasOwnProperty(name) && funcNameToCategory[name] !== opts.category) {
      let oldCategory = funcNameToCategory[name];

      delete sc[oldCategory][name];

      if (Object.keys(sc[oldCategory]).length === 0) {
        delete sc[oldCategory];
      }
    }

    funcNameToCategory[name] = opts.category;
  }
}

function removeFunction(name) {
  delete sc[name];
  delete SC.prototype[name];

  if (funcNameToCategory.hasOwnProperty(name)) {
    let category = funcNameToCategory[name];

    delete sc[category][name];
    delete funcNameToCategory[name];

    if (Object.keys(sc[category]).length === 0) {
      delete sc[category];
    }
  }
}

function mixin(source = {}, opts = {}) {
  Object.keys(source).forEach((name) => {
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
