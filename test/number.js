"use strict";

import assert from "power-assert";
import config from "../src/config";
import * as sc from "../src/number";

let closeTo = (expected, actual, delta) => Math.abs(expected - actual) <= delta;
let randSeed = (list, i = 0) => () => list[i++ % list.length];

describe("sc.number", () => {
  before(() => {
    config.save();
  });
  after(() => {
    config.restore();
  });
  describe("abs(x)", () => {
    it("works", () => {
      assert(sc.abs(-2) === Math.abs(-2));
      assert(sc.abs(-1) === Math.abs(-1));
      assert(sc.abs( 0) === Math.abs( 0));
      assert(sc.abs(+1) === Math.abs(+1));
      assert(sc.abs(+2) === Math.abs(+2));
    });
  });
  describe("acos(x)", () => {
    it("works", () => {
      assert(sc.acos(-1.0) === Math.acos(-1.0));
      assert(sc.acos(-0.5) === Math.acos(-0.5));
      assert(sc.acos( 0.0) === Math.acos( 0.0));
      assert(sc.acos(+0.5) === Math.acos(+0.5));
      assert(sc.acos(+1.0) === Math.acos(+1.0));
    });
  });
  describe("acosh(x)", () => {
    it("works", () => {
      assert(sc.acosh(1) === Math.acosh(1));
      assert(sc.acosh(2) === Math.acosh(2));
      assert(sc.acosh(3) === Math.acosh(3));
    });
  });
  describe("ampdb(x)", () => {
    it("works", () => {
      assert(sc.ampdb(1) === 0);
      assert(closeTo(sc.ampdb(2), 6.020599913279, 1e-6));
      assert(closeTo(sc.ampdb(3), 9.542425094393, 1e-6));
      assert(closeTo(sc.ampdb(4), 12.04119982655, 1e-6));
      assert(closeTo(sc.ampdb(5), 13.97940008672, 1e-6));
    });
  });
  describe("asin(x)", () => {
    it("works", () => {
      assert(sc.asin(-1.0) === Math.asin(-1.0));
      assert(sc.asin(-0.5) === Math.asin(-0.5));
      assert(sc.asin( 0.0) === Math.asin( 0.0));
      assert(sc.asin(+0.5) === Math.asin(+0.5));
      assert(sc.asin(+1.0) === Math.asin(+1.0));
    });
  });
  describe("asinh(x)", () => {
    it("works", () => {
      assert(sc.asinh(1) === Math.asinh(1));
      assert(sc.asinh(2) === Math.asinh(2));
      assert(sc.asinh(3) === Math.asinh(3));
    });
  });
  describe("atan(x)", () => {
    it("works", () => {
      assert(sc.atan(-1.0) === Math.atan(-1.0));
      assert(sc.atan(-0.5) === Math.atan(-0.5));
      assert(sc.atan( 0.0) === Math.atan( 0.0));
      assert(sc.atan(+0.5) === Math.atan(+0.5));
      assert(sc.atan(+1.0) === Math.atan(+1.0));
    });
  });
  describe("atanh(x)", () => {
    it("works", () => {
      assert(sc.atanh(0.0) === Math.atanh(0.0));
      assert(sc.atanh(0.5) === Math.atanh(0.5));
      assert(sc.atanh(1.0) === Math.atanh(1.0));
    });
  });
  describe("atan2(y, x)", () => {
    it("works", () => {
      assert(sc.atan2(90, 15) === Math.atan2(90, 15));
      assert(sc.atan2(15, 90) === Math.atan2(15, 90));
    });
  });
  describe("bilinrand(x)", () => {
    it("works", () => {
      config.randomAPI = randSeed([ 0.9, 0.3, 0.2, 0.5, 0.0 ]);
      let randomAPI = randSeed([ 0.1, 0.6, 0.7, 0.4, 0.8 ]);

      assert(closeTo(sc.bilinrand( 1),  0.6, 1e-6));
      assert(closeTo(sc.bilinrand( 1), -0.3, 1e-6));
      assert(closeTo(sc.bilinrand(10, randomAPI), -5.0, 1e-6));
      assert(closeTo(sc.bilinrand(10, randomAPI),  3.0, 1e-6));
    });
  });
  describe("cbrt(x)", () => {
    it("works", () => {
      assert(sc.cbrt(-1.3) === Math.cbrt(-1.3));
      assert(sc.cbrt(-0.5) === Math.cbrt(-0.5));
      assert(sc.cbrt( 0.0) === Math.cbrt( 0.0));
      assert(sc.cbrt(+0.5) === Math.cbrt(+0.5));
      assert(sc.cbrt(+1.3) === Math.cbrt(+1.3));
    });
  });
  describe("ceil(x)", () => {
    it("works", () => {
      assert(sc.ceil(-1.3) === Math.ceil(-1.3));
      assert(sc.ceil(-0.5) === Math.ceil(-0.5));
      assert(sc.ceil( 0.0) === Math.ceil( 0.0));
      assert(sc.ceil(+0.5) === Math.ceil(+0.5));
      assert(sc.ceil(+1.3) === Math.ceil(+1.3));
    });
  });
  describe("clip(x, lo, hi)", () => {
    it("works", () => {
      assert(sc.clip(-2.0) === -1.0);
      assert(sc.clip(+2.0) === +1.0);
      assert(sc.clip(-1.0, -0.75, +0.75) === -0.75);
      assert(sc.clip(-0.5, -0.75, +0.75) === -0.50);
      assert(sc.clip( 0.0, -0.75, +0.75) ===  0.00);
      assert(sc.clip(+0.5, -0.75, +0.75) === +0.50);
      assert(sc.clip(+1.0, -0.75, +0.75) === +0.75);
    });
  });
  describe("clip2(x, range)", () => {
    it("works", () => {
      assert(sc.clip2(-2.0) === -1.0);
      assert(sc.clip2(+2.0) === +1.0);
      assert(sc.clip2(-1.0, 0.75) === -0.75);
      assert(sc.clip2(-0.5, 0.75) === -0.50);
      assert(sc.clip2( 0.0, 0.75) ===  0.00);
      assert(sc.clip2(+0.5, 0.75) === +0.50);
      assert(sc.clip2(+1.0, 0.75) === +0.75);
    });
  });
  describe("clz32(x)", () => {
    it("works", () => {
      assert(sc.clz32(1) === Math.clz32(1));
      assert(sc.clz32(100) === Math.clz32(100));
      assert(sc.clz32(1000) === Math.clz32(1000));
    });
  });
  describe("coin(x)", () => {
    it("works", () => {
      config.randomAPI = randSeed([ 0.9, 0.3, 0.2, 0.5, 0.0 ]);
      let randomAPI = randSeed([ 0.1, 0.6, 0.7, 0.4, 0.8 ]);

      assert(sc.coin(0.25) === false);
      assert(sc.coin(0.25) === false);
      assert(sc.coin(0.25, randomAPI) === true);
      assert(sc.coin(0.25, randomAPI) === false);
    });
  });
  describe("cos(x)", () => {
    it("works", () => {
      assert(sc.cos(-1.3) === Math.cos(-1.3));
      assert(sc.cos(-0.5) === Math.cos(-0.5));
      assert(sc.cos( 0.0) === Math.cos( 0.0));
      assert(sc.cos(+0.5) === Math.cos(+0.5));
      assert(sc.cos(+1.3) === Math.cos(+1.3));
    });
  });
  describe("cosh(x)", () => {
    it("works", () => {
      assert(sc.cosh(1) === Math.cosh(1));
      assert(sc.cosh(2) === Math.cosh(2));
      assert(sc.cosh(3) === Math.cosh(3));
    });
  });
  describe("cpsmidi(x)", () => {
    it("works", () => {
      assert(closeTo(sc.cpsmidi(261.6), 60, 1e-2));
      assert(closeTo(sc.cpsmidi(293.7), 62, 1e-2));
      assert(closeTo(sc.cpsmidi(329.6), 64, 1e-2));
      assert(closeTo(sc.cpsmidi(349.2), 65, 1e-2));
      assert(closeTo(sc.cpsmidi(392.0), 67, 1e-2));
      assert(closeTo(sc.cpsmidi(440.0), 69, 1e-2));
      assert(closeTo(sc.cpsmidi(493.9), 71, 1e-2));
    });
  });
  describe("cpsmidi(x)", () => {
    it("works", () => {
      assert(closeTo(sc.cpsmidi(261.6), 59.998308205033, 1e-6));
      assert(closeTo(sc.cpsmidi(293.7), 62.002076902954, 1e-6));
      assert(closeTo(sc.cpsmidi(329.6), 63.998552625254, 1e-6));
      assert(closeTo(sc.cpsmidi(349.2), 64.998600422609, 1e-6));
      assert(closeTo(sc.cpsmidi(392.0), 67.000201567087, 1e-6));
      assert(closeTo(sc.cpsmidi(440.0), 69.000000000000, 1e-6));
      assert(closeTo(sc.cpsmidi(493.9), 71.000585339597, 1e-6));
    });
  });
  describe("cpsoct(x)", () => {
    it("works", () => {
      assert(closeTo(sc.cpsoct(261.6), 3.9998590170687, 1e-6));
      assert(closeTo(sc.cpsoct(293.7), 4.1668397418955, 1e-6));
      assert(closeTo(sc.cpsoct(329.6), 4.3332127187539, 1e-6));
      assert(closeTo(sc.cpsoct(349.2), 4.4165500352001, 1e-6));
      assert(closeTo(sc.cpsoct(392.0), 4.5833501305732, 1e-6));
      assert(closeTo(sc.cpsoct(440.0), 4.7499999999827, 1e-6));
      assert(closeTo(sc.cpsoct(493.9), 4.9167154449491, 1e-6));
    });
  });
  describe("cubed(x)", () => {
    it("works", () => {
      assert(sc.cubed(-1.3) === Math.pow(-1.3, 3));
      assert(sc.cubed(-0.5) === Math.pow(-0.5, 3));
      assert(sc.cubed( 0.0) === Math.pow( 0.0, 3));
      assert(sc.cubed(+0.5) === Math.pow(+0.5, 3));
      assert(sc.cubed(+1.3) === Math.pow(+1.3, 3));
    });
  });
  describe("dbamp(x)", () => {
    it("works", () => {
      assert(sc.dbamp(0) === 1);
      assert(closeTo(sc.dbamp( 6), 1.995262314968, 1e-6));
      assert(closeTo(sc.dbamp( 9), 2.818382931264, 1e-6));
      assert(closeTo(sc.dbamp(12), 3.981071705535, 1e-6));
      assert(closeTo(sc.dbamp(13), 4.466835921509, 1e-6));
    });
  });
  describe("degrad(x)", () => {
    it("works", () => {
      assert(closeTo(sc.degrad(-370), -6.457718232379, 1e-6));
      assert(closeTo(sc.degrad(-120), -2.094395102393, 1e-6));
      assert(closeTo(sc.degrad(   0),  0.000000000000, 1e-6));
      assert(closeTo(sc.degrad(+120), +2.094395102393, 1e-6));
      assert(closeTo(sc.degrad(+370), +6.457718232379, 1e-6));
    });
  });
  describe("even(x)", () => {
    it("works", () => {
      assert(sc.even(-3) === false);
      assert(sc.even(-2) === true);
      assert(sc.even(-1) === false);
      assert(sc.even( 0) === true);
      assert(sc.even(+1) === false);
      assert(sc.even(+2) === true);
      assert(sc.even(+3) === false);
    });
  });
  describe("exp(x)", () => {
    it("works", () => {
      assert(sc.exp(-1.3) === Math.exp(-1.3));
      assert(sc.exp(-0.5) === Math.exp(-0.5));
      assert(sc.exp( 0.0) === Math.exp( 0.0));
      assert(sc.exp(+0.5) === Math.exp(+0.5));
      assert(sc.exp(+1.3) === Math.exp(+1.3));
    });
  });
  describe("expexp(value, inMin, inMax, outMin, outMax)", () => {
    it("works", () => {
      assert(closeTo(sc.expexp(0.1, 0.01, 1, 100, 8000), 894.42719099992, 1e-6));
      assert(closeTo(sc.expexp(0.3, 0.01, 1, 100, 8000), 2544.1770734984, 1e-6));
      assert(closeTo(sc.expexp(0.5, 0.01, 1, 100, 8000), 4136.6273756092, 1e-6));
      assert(closeTo(sc.expexp(0.7, 0.01, 1, 100, 8000), 5697.6242201394, 1e-6));
      assert(closeTo(sc.expexp(0.9, 0.01, 1, 100, 8000), 7236.8517487474, 1e-6));
    });
  });
  describe("explin(value, inMin, inMax, outMin, outMax)", () => {
    it("works", () => {
      assert(closeTo(sc.explin(0.1, 0.01, 1, 100, 8000), 4050, 1e-6));
      assert(closeTo(sc.explin(0.3, 0.01, 1, 100, 8000), 5934.6289561427, 1e-6));
      assert(closeTo(sc.explin(0.5, 0.01, 1, 100, 8000), 6810.9315171273, 1e-6));
      assert(closeTo(sc.explin(0.7, 0.01, 1, 100, 8000), 7388.1372580563, 1e-6));
      assert(closeTo(sc.explin(0.9, 0.01, 1, 100, 8000), 7819.2579122853, 1e-6));
    });
  });
  describe("expm1(x)", () => {
    it("works", () => {
      assert(sc.expm1(-1.3) === Math.expm1(-1.3));
      assert(sc.expm1(-0.5) === Math.expm1(-0.5));
      assert(sc.expm1( 0.0) === Math.expm1( 0.0));
      assert(sc.expm1(+0.5) === Math.expm1(+0.5));
      assert(sc.expm1(+1.3) === Math.expm1(+1.3));
    });
  });
  describe("exprand(a, b)", () => {
    it("works", () => {
      config.randomAPI = randSeed([ 0.9, 0.3, 0.2, 0.5, 0.0 ]);
      let randomAPI = randSeed([ 0.1, 0.6, 0.7, 0.4, 0.8 ]);

      assert(closeTo(sc.exprand(1, 10), 7.94328234724281, 1e-6));
      assert(closeTo(sc.exprand(1, 10), 1.99526231496888, 1e-6));
      assert(closeTo(sc.exprand(1, 100, randomAPI), 1.584893192461113, 1e-6));
      assert(closeTo(sc.exprand(1, 100, randomAPI), 15.84893192461114, 1e-6));
    });
  });
  describe("floor(x)", () => {
    it("works", () => {
      assert(sc.floor(-1.3) === Math.floor(-1.3));
      assert(sc.floor(-0.5) === Math.floor(-0.5));
      assert(sc.floor( 0.0) === Math.floor( 0.0));
      assert(sc.floor(+0.5) === Math.floor(+0.5));
      assert(sc.floor(+1.3) === Math.floor(+1.3));
    });
  });
  describe("fold(x, lo, hi)", () => {
    it("works", () => {
      assert(closeTo(sc.fold(-2.00, -0.2, 0.4),  0.40, 1e-6));
      assert(closeTo(sc.fold(-1.25, -0.2, 0.4), -0.05, 1e-6));
      assert(closeTo(sc.fold(-1.00, -0.2, 0.4),  0.20, 1e-6));
      assert(closeTo(sc.fold(-0.75, -0.2, 0.4),  0.35, 1e-6));
      assert(closeTo(sc.fold(-0.50, -0.2, 0.4),  0.10, 1e-6));
      assert(closeTo(sc.fold(-0.25, -0.2, 0.4), -0.15, 1e-6));
      assert(closeTo(sc.fold( 0.00, -0.2, 0.4),  0.00, 1e-6));
      assert(closeTo(sc.fold(+0.25, -0.2, 0.4),  0.25, 1e-6));
      assert(closeTo(sc.fold(+0.50, -0.2, 0.4),  0.30, 1e-6));
      assert(closeTo(sc.fold(+0.75, -0.2, 0.4),  0.05, 1e-6));
      assert(closeTo(sc.fold(+1.00, -0.2, 0.4), -0.20, 1e-6));
      assert(closeTo(sc.fold(+1.25, -0.2, 0.4),  0.05, 1e-6));
      assert(closeTo(sc.fold(+2.00, -0.2, 0.4),  0.00, 1e-6));
      assert(closeTo(sc.fold( 0.00,  0.0, 0.0),  0.00, 1e-6));
    });
  });
  describe("fold2(x, range)", () => {
    it("works", () => {
      assert(closeTo(sc.fold2(-2.00, 0.6),  0.40, 1e-6));
      assert(closeTo(sc.fold2(-1.25, 0.6),  0.05, 1e-6));
      assert(closeTo(sc.fold2(-1.00, 0.6), -0.20, 1e-6));
      assert(closeTo(sc.fold2(-0.75, 0.6), -0.45, 1e-6));
      assert(closeTo(sc.fold2(-0.50, 0.6), -0.50, 1e-6));
      assert(closeTo(sc.fold2(-0.25, 0.6), -0.25, 1e-6));
      assert(closeTo(sc.fold2( 0.00, 0.6),  0.00, 1e-6));
      assert(closeTo(sc.fold2(+0.25, 0.6),  0.25, 1e-6));
      assert(closeTo(sc.fold2(+0.50, 0.6),  0.50, 1e-6));
      assert(closeTo(sc.fold2(+0.75, 0.6),  0.45, 1e-6));
      assert(closeTo(sc.fold2(+1.00, 0.6),  0.20, 1e-6));
      assert(closeTo(sc.fold2(+1.25, 0.6), -0.05, 1e-6));
      assert(closeTo(sc.fold2(+2.00, 0.6), -0.40, 1e-6));
    });
  });
  describe("frac(x)", () => {
    it("works", () => {
      assert(closeTo(sc.frac(-1.60), 0.40, 1e-6));
      assert(closeTo(sc.frac(-1.20), 0.80, 1e-6));
      assert(closeTo(sc.frac(-0.80), 0.20, 1e-6));
      assert(closeTo(sc.frac(-0.40), 0.60, 1e-6));
      assert(closeTo(sc.frac( 0.00), 0.00, 1e-6));
      assert(closeTo(sc.frac(+0.40), 0.40, 1e-6));
      assert(closeTo(sc.frac(+0.80), 0.80, 1e-6));
      assert(closeTo(sc.frac(+1.20), 0.20, 1e-6));
      assert(closeTo(sc.frac(+1.60), 0.60, 1e-6));
    });
  });
  describe("fround(x)", () => {
    it("works", () => {
      assert(sc.fround(-1.3) === Math.fround(-1.3));
      assert(sc.fround(-0.5) === Math.fround(-0.5));
      assert(sc.fround(-0.0) === Math.fround(-0.0));
      assert(sc.fround(+0.5) === Math.fround(+0.5));
      assert(sc.fround(+1.3) === Math.fround(+1.3));
    });
  });
  describe("hypot(x, y)", () => {
    it("works", () => {
      assert(closeTo([ 3, 4, 5 ].reduce(sc.hypot), 7.0710678118654755, 1e-6));
    });
  });
  describe("half(x)", () => {
    it("works", () => {
      assert(sc.half(-0.75) === -0.75 / 2);
      assert(sc.half(-0.25) === -0.25 / 2);
      assert(sc.half( 0.00) ===  0.00 / 2);
      assert(sc.half(+0.25) === +0.25 / 2);
      assert(sc.half(+0.75) === +0.75 / 2);
    });
  });
  describe("imul(a, b)", () => {
    it("works", () => {
      assert(sc.imul(2, 4) === Math.imul(2, 4));
      assert(sc.imul(-1, 8) === Math.imul(-1, 8));
      assert(sc.imul(-2, -2) === Math.imul(-2, -2));
    });
  });
  describe("linexp(value, inMin, inMax, outMin, outMax)", () => {
    it("works", () => {
      assert(closeTo(sc.linexp(0.1, 0.01, 1, 100, 8000), 148.93891324884, 1e-6));
      assert(closeTo(sc.linexp(0.3, 0.01, 1, 100, 8000), 360.96974634425, 1e-6));
      assert(closeTo(sc.linexp(0.5, 0.01, 1, 100, 8000), 874.84966106965, 1e-6));
      assert(closeTo(sc.linexp(0.7, 0.01, 1, 100, 8000), 2120.2938396499, 1e-6));
      assert(closeTo(sc.linexp(0.9, 0.01, 1, 100, 8000), 5138.7640259933, 1e-6));
    });
  });
  describe("linlin(value, inMin, inMax, outMin, outMax)", () => {
    it("works", () => {
      assert(closeTo(sc.linlin(0.1, 0.01, 1, 100, 8000), 818.1818181818, 1e-6));
      assert(closeTo(sc.linlin(0.3, 0.01, 1, 100, 8000), 2414.141414141, 1e-6));
      assert(closeTo(sc.linlin(0.5, 0.01, 1, 100, 8000), 4010.101010101, 1e-6));
      assert(closeTo(sc.linlin(0.7, 0.01, 1, 100, 8000), 5606.060606060, 1e-6));
      assert(closeTo(sc.linlin(0.9, 0.01, 1, 100, 8000), 7202.020202020, 1e-6));
    });
  });
  describe("linrand(x)", () => {
    it("works", () => {
      config.randomAPI = randSeed([ 0.9, 0.3, 0.2, 0.5, 0.0 ]);
      let randomAPI = randSeed([ 0.1, 0.6, 0.7, 0.4, 0.8 ]);

      assert(sc.linrand(1) === 0.3);
      assert(sc.linrand(1) === 0.2);
      assert(sc.linrand(10, randomAPI) === 1);
      assert(sc.linrand(10, randomAPI) === 4);
    });
  });
  describe("log(x)", () => {
    it("works", () => {
      assert(sc.log( 0.0) === Math.log( 0.0));
      assert(sc.log(+0.5) === Math.log(+0.5));
      assert(sc.log(+1.3) === Math.log(+1.3));
    });
  });
  describe("log10(x)", () => {
    it("works", () => {
      assert(sc.log10( 0.0) === Math.log10( 0.0));
      assert(sc.log10(+0.5) === Math.log10(+0.5));
      assert(sc.log10(+1.3) === Math.log10(+1.3));
    });
  });
  describe("log1p(x)", () => {
    it("works", () => {
      assert(sc.log1p(-0.5) === Math.log1p(-0.5));
      assert(sc.log1p( 0.0) === Math.log1p( 0.0));
      assert(sc.log1p(+0.5) === Math.log1p(+0.5));
    });
  });
  describe("log2(x)", () => {
    it("works", () => {
      assert(sc.log2( 0.0) === Math.log2( 0.0));
      assert(sc.log2(+0.5) === Math.log2(+0.5));
      assert(sc.log2(+1.3) === Math.log2(+1.3));
    });
  });
  describe("max(a, b)", () => {
    it("works", () => {
      assert([ 2, 5, 0, 3, 1, 4 ].reduce(sc.max) === 5);
    });
  });
  describe("midicps(midi)", () => {
    it("works", () => {
      assert(closeTo(sc.midicps(60), 261.625565300, 1e-6));
      assert(closeTo(sc.midicps(62), 293.664767917, 1e-6));
      assert(closeTo(sc.midicps(64), 329.627556912, 1e-6));
      assert(closeTo(sc.midicps(65), 349.228231433, 1e-6));
      assert(closeTo(sc.midicps(67), 391.995435981, 1e-6));
      assert(closeTo(sc.midicps(69), 440.000000000, 1e-6));
      assert(closeTo(sc.midicps(71), 493.883301256, 1e-6));
    });
  });
  describe("midiratio(midi)", () => {
    it("works", () => {
      assert(closeTo(sc.midiratio( 0), 1.0000000000000, 1e-6));
      assert(closeTo(sc.midiratio( 2), 1.1224620483089, 1e-6));
      assert(closeTo(sc.midiratio( 4), 1.2599210498937, 1e-6));
      assert(closeTo(sc.midiratio( 5), 1.3348398541685, 1e-6));
      assert(closeTo(sc.midiratio( 7), 1.4983070768743, 1e-6));
      assert(closeTo(sc.midiratio( 9), 1.6817928305039, 1e-6));
      assert(closeTo(sc.midiratio(11), 1.8877486253586, 1e-6));
    });
  });
  describe("min(a, b)", () => {
    it("works", () => {
      assert([ 2, 5, 0, 3, 1, 4 ].reduce(sc.min) === 0);
    });
  });
  describe("neg(x)", () => {
    it("works", () => {
      assert(sc.neg(-1.3) === +1.3);
      assert(sc.neg(-0.5) === +0.5);
      assert(sc.neg( 0.0) === -0.0);
      assert(sc.neg(+0.5) === -0.5);
      assert(sc.neg(+1.3) === -1.3);
    });
  });
  describe("octcps(oct)", () => {
    it("works", () => {
      assert(closeTo(sc.octcps(1), 32.70319566257, 1e-6));
      assert(closeTo(sc.octcps(2), 65.40639132515, 1e-6));
      assert(closeTo(sc.octcps(3), 130.8127826503, 1e-6));
      assert(closeTo(sc.octcps(4), 261.6255653006, 1e-6));
      assert(closeTo(sc.octcps(5), 523.2511306012, 1e-6));
    });
  });
  describe("odd(x)", () => {
    it("works", () => {
      assert(sc.odd(-3) === true);
      assert(sc.odd(-2) === false);
      assert(sc.odd(-1) === true);
      assert(sc.odd( 0) === false);
      assert(sc.odd(+1) === true);
      assert(sc.odd(+2) === false);
      assert(sc.odd(+3) === true);
    });
  });
  describe("pow(base, exponent)", () => {
    it("works", () => {
      assert(sc.pow(-1.3, 2) === Math.pow(-1.3, 2));
      assert(sc.pow(-0.5, 2) === Math.pow(-0.5, 2));
      assert(sc.pow(-0.0, 2) === Math.pow(-0.0, 2));
      assert(sc.pow(+0.5, 2) === Math.pow(+0.5, 2));
      assert(sc.pow(+1.3, 2) === Math.pow(+1.3, 2));
    });
  });
  describe("raddeg(rad)", () => {
    it("works", () => {
      assert(closeTo(sc.raddeg(-2), -114.59155902616, 1e-6));
      assert(closeTo(sc.raddeg(-1), -57.295779513082, 1e-6));
      assert(sc.raddeg(0) === 0);
      assert(closeTo(sc.raddeg(+1), +57.295779513082, 1e-6));
      assert(closeTo(sc.raddeg(+2), +114.59155902616, 1e-6));
    });
  });
  describe("rand(x)", () => {
    it("works", () => {
      config.randomAPI = randSeed([ 0.9, 0.3, 0.2, 0.5, 0.0 ]);
      let randomAPI = randSeed([ 0.1, 0.6, 0.7, 0.4, 0.8 ]);

      assert(sc.rand(1) === 0.9);
      assert(sc.rand(1) === 0.3);
      assert(sc.rand(10, randomAPI) === 1);
      assert(sc.rand(10, randomAPI) === 6);
    });
  });
  describe("rand2(x)", () => {
    it("works", () => {
      config.randomAPI = randSeed([ 0.9, 0.3, 0.2, 0.5, 0.0 ]);
      let randomAPI = randSeed([ 0.1, 0.6, 0.7, 0.4, 0.8 ]);

      assert(closeTo(sc.rand2(1),  0.8, 1e-6));
      assert(closeTo(sc.rand2(1), -0.4, 1e-6));
      assert(closeTo(sc.rand2(10, randomAPI), -8, 1e-6));
      assert(closeTo(sc.rand2(10, randomAPI),  2, 1e-6));
    });
  });
  describe("random()", () => {
    it("works", () => {
      config.randomAPI = randSeed([ 0.9, 0.3, 0.2, 0.5, 0.0 ]);
      let randomAPI = randSeed([ 0.1, 0.6, 0.7, 0.4, 0.8 ]);

      assert(sc.random() === 0.9);
      assert(sc.random() === 0.3);
      assert(sc.random(randomAPI) === 0.1);
      assert(sc.random(randomAPI) === 0.6);
    });
  });
  describe("ratiomidi(oct)", () => {
    it("works", () => {
      assert(sc.ratiomidi(1) === 0);
      assert(sc.ratiomidi(2) === 12);
      assert(closeTo(sc.ratiomidi(3), 19.019550008654, 1e-6));
      assert(sc.ratiomidi(4) === 24);
      assert(closeTo(sc.ratiomidi(5), 27.863137138648, 1e-6));
    });
  });
  describe("reciprocal(x)", () => {
    it("works", () => {
      assert(sc.reciprocal(-1.0) === 1 / -1.0);
      assert(sc.reciprocal(-0.5) === 1 / -0.5);
      assert(sc.reciprocal(+0.5) === 1 / +0.5);
      assert(sc.reciprocal(+1.0) === 1 / +1.0);
    });
  });
  describe("round(x)", () => {
    it("works", () => {
      assert(sc.round(-1.3) === Math.round(-1.3));
      assert(sc.round(-0.5) === Math.round(-0.5));
      assert(sc.round( 0.0) === Math.round( 0.0));
      assert(sc.round(+0.5) === Math.round(+0.5));
      assert(sc.round(+1.3) === Math.round(+1.3));
    });
  });
  describe("rrand(a, b)", () => {
    it("works", () => {
      config.randomAPI = randSeed([ 0.9, 0.3, 0.2, 0.5, 0.0 ]);
      let randomAPI = randSeed([ 0.1, 0.6, 0.7, 0.4, 0.8 ]);

      assert(closeTo(sc.rrand(1, 10), 9.1, 1e-6));
      assert(closeTo(sc.rrand(1, 10), 3.7, 1e-6));
      assert(closeTo(sc.rrand(1, 100, randomAPI), 10.9, 1e-6));
      assert(closeTo(sc.rrand(1, 100, randomAPI), 60.4, 1e-6));
    });
  });
  describe("sign(x)", () => {
    it("works", () => {
      assert(sc.sign(-1.3) === Math.sign(-1.3));
      assert(sc.sign(-0.5) === Math.sign(-0.5));
      assert(sc.sign(-0.0) === Math.sign(-0.0));
      assert(sc.sign(+0.5) === Math.sign(+0.5));
      assert(sc.sign(+1.3) === Math.sign(+1.3));
    });
  });
  describe("sin(x)", () => {
    it("works", () => {
      assert(sc.sin(-1.3) === Math.sin(-1.3));
      assert(sc.sin(-0.5) === Math.sin(-0.5));
      assert(sc.sin(-0.0) === Math.sin(-0.0));
      assert(sc.sin(+0.5) === Math.sin(+0.5));
      assert(sc.sin(+1.3) === Math.sin(+1.3));
    });
  });
  describe("sinh(x)", () => {
    it("works", () => {
      assert(sc.sinh(1) === Math.sinh(1));
      assert(sc.sinh(2) === Math.sinh(2));
      assert(sc.sinh(3) === Math.sinh(3));
    });
  });
  describe("sqrt(x)", () => {
    it("works", () => {
      assert(sc.sqrt(-0.0) === Math.sqrt(-0.0));
      assert(sc.sqrt(+0.5) === Math.sqrt(+0.5));
      assert(sc.sqrt(+1.3) === Math.sqrt(+1.3));
    });
  });
  describe("squared(x)", () => {
    it("works", () => {
      assert(sc.squared(-1.3) === Math.pow(-1.3, 2));
      assert(sc.squared(-0.5) === Math.pow(-0.5, 2));
      assert(sc.squared( 0.0) === Math.pow( 0.0, 2));
      assert(sc.squared(+0.5) === Math.pow(+0.5, 2));
      assert(sc.squared(+1.3) === Math.pow(+1.3, 2));
    });
  });
  describe("tan(x)", () => {
    it("works", () => {
      assert(sc.tan(-1.3) === Math.tan(-1.3));
      assert(sc.tan(-0.5) === Math.tan(-0.5));
      assert(sc.tan(-0.0) === Math.tan(-0.0));
      assert(sc.tan(+0.5) === Math.tan(+0.5));
      assert(sc.tan(+1.3) === Math.tan(+1.3));
    });
  });
  describe("tanh(x)", () => {
    it("works", () => {
      assert(sc.tanh(-1.3) === Math.tanh(-1.3));
      assert(sc.tanh(-0.5) === Math.tanh(-0.5));
      assert(sc.tanh(-0.0) === Math.tanh(-0.0));
      assert(sc.tanh(+0.5) === Math.tanh(+0.5));
      assert(sc.tanh(+1.3) === Math.tanh(+1.3));
    });
  });
  describe("trunc(x)", () => {
    it("works", () => {
      assert(sc.trunc(-1.3) === Math.trunc(-1.3));
      assert(sc.trunc(-0.5) === Math.trunc(-0.5));
      assert(sc.trunc(-0.0) === Math.trunc(-0.0));
      assert(sc.trunc(+0.5) === Math.trunc(+0.5));
      assert(sc.trunc(+1.3) === Math.trunc(+1.3));
    });
  });
  describe("twice(x)", () => {
    it("works", () => {
      assert(sc.twice(-0.75) === -0.75 * 2);
      assert(sc.twice(-0.25) === -0.25 * 2);
      assert(sc.twice( 0.00) ===  0.00 * 2);
      assert(sc.twice(+0.25) === +0.25 * 2);
      assert(sc.twice(+0.75) === +0.75 * 2);
    });
  });
  describe("wrap(x, lo, hi)", () => {
    it("works", () => {
      assert(closeTo(sc.wrap(-2.00, -0.2, 0.4), -0.20, 1e-6));
      assert(closeTo(sc.wrap(-1.25, -0.2, 0.4), -0.05, 1e-6));
      assert(closeTo(sc.wrap(-1.00, -0.2, 0.4),  0.20, 1e-6));
      assert(closeTo(sc.wrap(-0.75, -0.2, 0.4), -0.15, 1e-6));
      assert(closeTo(sc.wrap(-0.50, -0.2, 0.4),  0.10, 1e-6));
      assert(closeTo(sc.wrap(-0.25, -0.2, 0.4),  0.35, 1e-6));
      assert(closeTo(sc.wrap( 0.00, -0.2, 0.4),  0.00, 1e-6));
      assert(closeTo(sc.wrap(+0.25, -0.2, 0.4),  0.25, 1e-6));
      assert(closeTo(sc.wrap(+0.50, -0.2, 0.4), -0.10, 1e-6));
      assert(closeTo(sc.wrap(+0.75, -0.2, 0.4),  0.15, 1e-6));
      assert(closeTo(sc.wrap(+1.00, -0.2, 0.4),  0.40, 1e-6));
      assert(closeTo(sc.wrap(+1.25, -0.2, 0.4),  0.05, 1e-6));
      assert(closeTo(sc.wrap(+2.00, -0.2, 0.4),  0.20, 1e-6));
      assert(closeTo(sc.wrap( 0.00,  0.0, 0.0),  0.00, 1e-6));
    });
  });
  describe("wrap2(x, range)", () => {
    it("works", () => {
      assert(closeTo(sc.wrap2(-2.00, 0.6),  0.40, 1e-6));
      assert(closeTo(sc.wrap2(-1.25, 0.6), -0.05, 1e-6));
      assert(closeTo(sc.wrap2(-1.00, 0.6),  0.20, 1e-6));
      assert(closeTo(sc.wrap2(-0.75, 0.6),  0.45, 1e-6));
      assert(closeTo(sc.wrap2(-0.50, 0.6), -0.50, 1e-6));
      assert(closeTo(sc.wrap2(-0.25, 0.6), -0.25, 1e-6));
      assert(closeTo(sc.wrap2( 0.00, 0.6),  0.00, 1e-6));
      assert(closeTo(sc.wrap2(+0.25, 0.6),  0.25, 1e-6));
      assert(closeTo(sc.wrap2(+0.50, 0.6),  0.50, 1e-6));
      assert(closeTo(sc.wrap2(+0.75, 0.6), -0.45, 1e-6));
      assert(closeTo(sc.wrap2(+1.00, 0.6), -0.20, 1e-6));
      assert(closeTo(sc.wrap2(+1.25, 0.6),  0.05, 1e-6));
      assert(closeTo(sc.wrap2(+2.00, 0.6), -0.40, 1e-6));
    });
  });
});
