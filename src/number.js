"use strict";

import config from "./config";
import * as util from "./util";

/// # sc.abs(x)
/// Math.abs
export let abs = Math.abs;

/// # sc.acos(x)
/// Math.acos
export let acos = Math.acos;

/// # sc.acosh(x)
/// Math.acosh
export let acosh = Math.acosh;

/// # sc.ampdb(x)
/// Convert a linear amplitude to decibels.
export function ampdb(x) {
  return Math.log(x) * Math.LOG10E * 20;
}

/// # sc.asin(x)
/// Math.asin
export let asin = Math.asin;

/// # sc.asinh(x)
/// Math.asinh
export let asinh = Math.asinh;

/// # sc.atan(x)
/// Math.atan
export let atan = Math.atan;

/// # sc.atanh(x)
/// Math.atanh
export let atanh = Math.atanh;

/// # sc.atan2(y, x)
/// Math.atan2
export let atan2 = Math.atan2;

/// # sc.bilinrand(x, rand=sc.config.randomAPI)
/// Bilateral linearly distributed random number from -_x_ to +_x_.
export function bilinrand(x, rand) {
  rand = util.defaults(rand, config.randomAPI);
  return (rand() - rand()) * x;
}

/// # sc.cbrt(x)
/// Math.cbrt
export let cbrt = Math.cbrt;

/// # sc.ceil(x)
/// Math.ceil
export let ceil = Math.ceil;

/// # sc.clip(x, lo=-1, hi=+1)
/// `Math.max(lo, Math.min(x, hi))`
export function clip(x, lo, hi) {
  lo = util.defaults(lo, -1);
  hi = util.defaults(hi, +1);

  lo = Math.min(lo, hi);
  hi = Math.max(lo, hi);

  return Math.max(lo, Math.min(x, hi));
}

/// # sc.clip2(x, range=1)
/// `sc.clip(x, -range, +range)`
export function clip2(x, range) {
  let hi = Math.abs(util.defaults(range, 1));
  let lo = -hi;

  return Math.max(lo, Math.min(x, hi));
}

/// # sc.clz32(x)
/// Math.clz32
export let clz32 = Math.clz32;

/// # sc.coin(x, rand=sc.config.randomAPI)
/// Answers a Boolean which is the result of a random test whose probability of success in a range from zero to one is this.
export function coin(x, rand) {
  rand = util.defaults(rand, config.randomAPI);
  return rand() < x;
}

/// # sc.cos(x)
/// Math.cos
export let cos = Math.cos;

/// # sc.cosh(x)
/// Math.cosh
export let cosh = Math.cosh;

/// # sc.cpsmidi(cps, baseFreq=sc.config.baseFreq)
/// Convert cycles per second to MIDI note.
/// ### Example
/// ```
/// sc.cpsmidi(440); // => 69
/// ```
export function cpsmidi(cps, baseFreq) {
  baseFreq = util.defaults(baseFreq, config.baseFreq);
  return Math.log(cps * 1 / baseFreq) * Math.LOG2E * 12 + 69;
}

/// # sc.cpsoct(cps, baseFreq=sc.config.baseFreq)
/// Convert cycles per second to decimal octaves.
export function cpsoct(cps, baseFreq) {
  baseFreq = util.defaults(baseFreq, config.baseFreq);
  return Math.log(cps * 1 / baseFreq) * Math.LOG2E + 4.75;
}

/// # sc.cubed(x)
/// x ^ 3
export function cubed(x) {
  return x * x * x;
}

/// # sc.dbamp(x)
/// Convert a decibels to a linear amplitude.
export function dbamp(x) {
  return Math.pow(10, x * 0.05);
}

/// # sc.degrad(deg)
/// Convert degree to radian
export function degrad(deg) {
  return deg * Math.PI / 180;
}

/// # sc.even(x)
/// `true` if dividable by 2 with no rest
export function even(x) {
  return (x & 1) === 0;
}

/// # sc.exp(x)
/// Math.exp
export let exp = Math.exp;

/// # sc.expexp(value, inMin, inMax, outMin, outMax)
/// Map a value from an exponential range to an exponential range
export function expexp(value, inMin, inMax, outMin, outMax) {
  return Math.pow(outMax / outMin, Math.log(value / inMin) / Math.log(inMax / inMin)) * outMin;
}

/// # sc.explin(value, inMin, inMax, outMin, outMax)
/// Map a value from an exponential range to a linear range
export function explin(value, inMin, inMax, outMin, outMax) {
  return (((Math.log(value / inMin)) / (Math.log(inMax / inMin))) * (outMax - outMin)) + outMin;
}

/// # sc.expm1(x)
/// Math.expm1
export let expm1 = Math.expm1;

/// # sc.exprand(a, b, rand=sc.config.randomAPI)
/// Return an exponentially distributed random number in the interval ]a, b[.
export function exprand(a, b, rand) {
  rand = util.defaults(rand, config.randomAPI);
  [ a, b ] = [ Math.min(a, b), Math.max(a, b) ];
  return a * Math.exp(Math.log(b / a) * rand());
}

/// # sc.floor(x)
/// Math.floor
export let floor = Math.floor;

/// # sc.fold(x, lo, hi)
/// the folded value, a bitwise or with aNumber
export function fold(x, lo, hi) {
  if (hi === lo) {
    return lo;
  }

  [ lo, hi ] = [ Math.min(lo, hi), Math.max(lo, hi) ];

  if (hi <= x) {
    x = hi + hi - x;
    if (lo <= x) {
      return x;
    }
  } else if (x < lo) {
    x = lo + lo - x;
    if (x < hi) {
      return x;
    }
  } else {
    return x;
  }

  let dx = x - lo;
  let range = hi - lo;
  let range2 = range + range;
  let c = dx - range2 * Math.floor(dx / range2);

  if (range <= c) {
    c = range2 - c;
  }

  return c + lo;
}

/// # sc.fold2(x, range)
/// `sc.fold(x, -range, +range)`
export function fold2(x, range) {
  return fold(x, -range, +range);
}

/// # sc.frac(x)
/// Fractional part
export function frac(x) {
  return x - Math.floor(x);
}

/// # sc.fround(x)
/// Math.fround
export let fround = Math.fround;

/// # sc.half(x)
/// x / 2
export function half(x) {
  return x / 2;
}

/// # sc.hypotx2(x, y)
/// Math.hypot(x, y)
export function hypot(x, y) {
  return Math.hypot(x, y);
}

/// # sc.imul(a, b)
/// Math.imul
export let imul = Math.imul;

/// # sc.linexp(value, inMin, inMax, outMin, outMax)
/// map a value from a linear range to an exponential range
export function linexp(value, inMin, inMax, outMin, outMax) {
  return Math.pow(outMax / outMin, (value - inMin) / (inMax - inMin)) * outMin;
}

/// # sc.linlin(value, inMin, inMax, outMin, outMax)
/// map a value from a linear range to a linear range
export function linlin(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
}

/// # sc.linrand(x, rand=sc.config.randomAPI)
/// Return a linearly distributed random number from zero to this.
export function linrand(x, rand) {
  rand = util.defaults(rand, config.randomAPI);
  return Math.min(rand(), rand()) * x;
}

/// # sc.log(x)
/// Math.log
export let log = Math.log;

/// # sc.log10(x)
/// Math.log10
export let log10 = Math.log10;

/// # sc.log1p(x)
/// Math.log1p
export let log1p = Math.log1p;

/// # sc.log2(x)
/// Math.log2
export let log2 = Math.log2;

/// # sc.max2(a, b)
/// a < b ? b : a;
export function max(a, b) {
  return Math.max(a, b);
}

/// # sc.midicps(midi, baseFreq=sc.config.baseFreq)
/// Convert MIDI note to cycles per second.
/// ### Example
/// ```
/// sc.midicps(69); // => 440
/// ```
export function midicps(midi, baseFreq) {
  baseFreq = util.defaults(baseFreq, config.baseFreq);
  return baseFreq * Math.pow(2, (midi - 69) * 1 / 12);
}

/// # sc.midiratio(midi)
/// Convert an interval in semitones to a ratio.
/// ### Example
/// ```
/// sc.midiratio(7); // => 1.4983070768743
/// ```
export function midiratio(midi) {
  return Math.pow(2, midi * 1 / 12);
}

/// # sc.min(a, b)
/// a < b ? a : b;
export function min(a, b) {
  return Math.min(a, b);
}

/// # sc.neg(x)
/// Negation
export function neg(x) {
  return -x;
}

/// # sc.octcps(oct, baseFreq=sc.config.baseFreq)
/// Convert decimal octaves to cycles per second.
export function octcps(oct, baseFreq) {
  baseFreq = util.defaults(baseFreq, config.baseFreq);
  return baseFreq * Math.pow(2, oct - 4.75);
}

/// # sc.odd(x)
/// `true` if not dividable by 2 with no rest
export function odd(x) {
  return (x & 1) === 1;
}

/// # sc.pow(base, exponent)
/// Math.pow
export let pow = Math.pow;

/// # sc.raddeg(deg)
/// Convert radian to degree.
export function raddeg(rad) {
  return rad * 180 / Math.PI;
}

/// # sc.rand(x, rand=sc.config.randomAPI)
/// Random a number from zero up to the _x_, exclusive.
export function rand(x, rand) {
  rand = util.defaults(rand, config.randomAPI);
  return rand() * x;
}

/// # sc.rand2(x, rand=sc.config.randomAPI)
/// Return a random number from -_x_ to +_x_.
export function rand2(x, rand) {
  rand = util.defaults(rand, config.randomAPI);
  return (rand() * 2 - 1) * x;
}

/// # sc.random(rand=sc.config.randomAPI)
/// Math.random
export function random(rand) {
  rand = util.defaults(rand, config.randomAPI);
  return rand();
}

/// # sc.ratiomidi(ratio)
/// Convert a ratio to an interval in semitone.
/// ### Example
/// ```
/// sc.ratiomidi(1.5); // => 7.0195500086539
/// ```
export function ratiomidi(ratio) {
  return Math.log(ratio) * Math.LOG2E * 12;
}

/// # sc.reciprocal(x)
/// 1 / x
export function reciprocal(x) {
  return 1 / x;
}

/// # sc.round(x)
/// Math.round
export let round = Math.round;

/// # sc.rrand(a, b, rand=sc.config.randomAPI)
/// Return a random number in the interval ]a, b[.
export function rrand(a, b, rand) {
  rand = util.defaults(rand, config.randomAPI);
  [ a, b ] = [ Math.min(a, b), Math.max(a, b) ];
  return a + rand() * (b - a);
}

/// # sc.sin(x)
/// Math.sin
export let sin = Math.sin;

/// # sc.sign(x)
/// Math.sign
export let sign = Math.sign;

/// # sc.sinh(x)
/// Math.sinh
export let sinh = Math.sinh;

/// # sc.sqrt(x)
/// Math.sqrt
export let sqrt = Math.sqrt;

/// # sc.squared(x)
/// x ^ 2
export function squared(x) {
  return x * x;
}

/// # sc.tan(x)
/// Math.tan
export let tan = Math.tan;

/// # sc.tanh(x)
/// Math.tanh
export let tanh = Math.tanh;

/// # sc.trunc(x)
/// Math.trunc
export let trunc = Math.trunc;

/// # sc.twice(x)
/// x * 2
export function twice(x) {
  return x * 2;
}

/// # sc.wrap(x, lo, hi)
/// Wrapping at _lo_ and _hi_
export function wrap(x, lo, hi) {
  if (hi === lo) {
    return lo;
  }

  lo = Math.min(lo, hi);
  hi = Math.max(lo, hi);

  let range = hi - lo;

  if (hi <= x) {
    x -= range;
    if (x < hi) {
      return x;
    }
  } else if (x < lo) {
    x += range;
    if (lo <= x) {
      return x;
    }
  } else {
    return x;
  }

  return x - range * Math.floor((x - lo) / range);
}

/// # sc.wrap2(x, range)
/// `sc.wrap(x, -range, +range)`
export function wrap2(x, range) {
  return wrap(x, -range, +range);
}
