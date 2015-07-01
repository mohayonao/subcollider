import assert from "power-assert";
import config from "../src/config";
import * as sc from "../src/array";

function closeTo(expected, actual, delta) {
  return Math.abs(expected - actual) <= delta;
}

function randSeed(list, i = 0) {
  return () => list[i++ % list.length];
}

describe("sc.array", () => {
  let array, undef;

  before(() => {
    config.save();
  });
  beforeEach(() => {
    array = [ 0, 10, 20, 30, 40, 20, 40, 60 ];
  });
  after(() => {
    config.restore();
  });

  describe("at(array, index)", () => {
    it("works", () => {
      assert(sc.at(array, -2) === undef);
      assert(sc.at(array, -1) === undef);
      assert(sc.at(array, 0) === 0);
      assert(sc.at(array, 1) === 10);
      assert(sc.at(array, 2) === 20);
      assert(sc.at(array, 3) === 30);
      assert(sc.at(array, 4) === 40);
      assert(sc.at(array, 5) === 20);
      assert(sc.at(array, 6) === 40);
      assert(sc.at(array, 7) === 60);
      assert(sc.at(array, 8) === undef);
      assert(sc.at(array, 9) === undef);
    });
  });
  describe("blendAt(array, index, method)", () => {
    it("works", () => {
      assert(sc.blendAt(array, -0.25) === 0);
      assert(sc.blendAt(array, 0.25) === 2.5);
      assert(sc.blendAt(array, 8.25) === 60);

      assert(sc.blendAt(array, -0.25, "wrapAt") === 15);
      assert(sc.blendAt(array, 8.25, "wrapAt") === 2.5);

      assert(sc.blendAt(array, -0.25, "foldAt") === 2.5);
      assert(sc.blendAt(array, 8.25, "foldAt") === 35);
    });
  });
  describe("choose(array, index)", () => {
    it("works", () => {
      config.randSeed(12345);

      assert(sc.choose(array) === 20);
      assert(sc.choose(array) === 40);
      assert(sc.choose(array) === 0);
      assert(sc.choose(array) === 10);

      let randomAPI = randSeed([ 0.1, 0.6, 0.7, 0.4, 0.8 ]);

      assert(sc.choose(array, randomAPI) === 0);
      assert(sc.choose(array, randomAPI) === 40);
    });
  });
  describe("clipAt(array, index)", () => {
    it("works", () => {
      assert(sc.clipAt(array, -2) === 0);
      assert(sc.clipAt(array, -1) === 0);
      assert(sc.clipAt(array, 0) === 0);
      assert(sc.clipAt(array, 1) === 10);
      assert(sc.clipAt(array, 2) === 20);
      assert(sc.clipAt(array, 3) === 30);
      assert(sc.clipAt(array, 4) === 40);
      assert(sc.clipAt(array, 5) === 20);
      assert(sc.clipAt(array, 6) === 40);
      assert(sc.clipAt(array, 7) === 60);
      assert(sc.clipAt(array, 8) === 60);
    });
  });
  describe("clipExtend(array, length)", () => {
    it("works", () => {
      assert.deepEqual(sc.clipExtend(array, 20), [
        0, 10, 20, 30, 40, 20, 40, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60,
      ]);
      assert.deepEqual(sc.clipExtend(new Float32Array(array), 20), new Float32Array([
        0, 10, 20, 30, 40, 20, 40, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60,
      ]));
    });
  });
  describe("foldAt(array, index)", () => {
    it("works", () => {
      assert(sc.foldAt(array, -9) === 20);
      assert(sc.foldAt(array, -8) === 40);
      assert(sc.foldAt(array, -7) === 60);
      assert(sc.foldAt(array, -6) === 40);
      assert(sc.foldAt(array, -5) === 20);
      assert(sc.foldAt(array, -4) === 40);
      assert(sc.foldAt(array, -3) === 30);
      assert(sc.foldAt(array, -2) === 20);
      assert(sc.foldAt(array, -1) === 10);
      assert(sc.foldAt(array, 0) === 0);
      assert(sc.foldAt(array, 1) === 10);
      assert(sc.foldAt(array, 2) === 20);
      assert(sc.foldAt(array, 3) === 30);
      assert(sc.foldAt(array, 4) === 40);
      assert(sc.foldAt(array, 5) === 20);
      assert(sc.foldAt(array, 6) === 40);
      assert(sc.foldAt(array, 7) === 60);
      assert(sc.foldAt(array, 8) === 40);
      assert(sc.foldAt(array, 9) === 20);
      assert(sc.foldAt(array, 10) === 40);
      assert(sc.foldAt(array, 11) === 30);
      assert(sc.foldAt(array, 12) === 20);
      assert(sc.foldAt(array, 13) === 10);
      assert(sc.foldAt(array, 14) === 0);
      assert(sc.foldAt(array, 15) === 10);
      assert(sc.foldAt(array, 16) === 20);
      assert(sc.foldAt(array, 17) === 30);
      assert(sc.foldAt(array, 18) === 40);
      assert(sc.foldAt(array, 19) === 20);
      assert(sc.foldAt(array, 20) === 40);
    });
  });
  describe("foldExtend(array, length)", () => {
    it("works", () => {
      assert.deepEqual(sc.foldExtend(array, 20), [
        0, 10, 20, 30, 40, 20, 40, 60, 40, 20, 40, 30, 20, 10, 0, 10, 20, 30, 40, 20,
      ]);
      assert.deepEqual(sc.foldExtend(new Float32Array(array), 20), new Float32Array([
        0, 10, 20, 30, 40, 20, 40, 60, 40, 20, 40, 30, 20, 10, 0, 10, 20, 30, 40, 20,
      ]));
    });
  });
  describe("indexOf(array, searchElement, fromIndex)", () => {
    it("works", () => {
      assert(sc.indexOf(array, 20) === 2);
      assert(sc.indexOf(array, 80) === -1);
      assert(sc.indexOf(array, 20, 4) === 5);
      assert(sc.indexOf(array, 20, -4) === 5);

      assert(sc.indexOf(new Float32Array(array), 20) === 2);
      assert(sc.indexOf(new Float32Array(array), 80) === -1);
      assert(sc.indexOf(new Float32Array(array), 20, 4) === 5);
      assert(sc.indexOf(new Float32Array(array), 20, -4) === 5);
    });
  });
  describe("lastIndexOf(array, searchElement, fromIndex)", () => {
    it("works", () => {
      assert(sc.lastIndexOf(array, 20) === 5);
      assert(sc.lastIndexOf(array, 80) === -1);
      assert(sc.lastIndexOf(array, 20, 4) === 2);
      assert(sc.lastIndexOf(array, 20, -4) === 2);

      assert(sc.lastIndexOf(new Float32Array(array), 20) === 5);
      assert(sc.lastIndexOf(new Float32Array(array), 80) === -1);
      assert(sc.lastIndexOf(new Float32Array(array), 20, 4) === 2);
      assert(sc.lastIndexOf(new Float32Array(array), 20, -4) === 2);
    });
  });
  describe("mirror(array)", () => {
    it("works", () => {
      assert.deepEqual(sc.mirror(array), [
        0, 10, 20, 30, 40, 20, 40, 60, 40, 20, 40, 30, 20, 10, 0,
      ]);
      assert.deepEqual(sc.mirror(new Float32Array(array)), new Float32Array([
        0, 10, 20, 30, 40, 20, 40, 60, 40, 20, 40, 30, 20, 10, 0,
      ]));
    });
  });
  describe("mirror1(array)", () => {
    it("works", () => {
      assert.deepEqual(sc.mirror1(array), [
        0, 10, 20, 30, 40, 20, 40, 60, 40, 20, 40, 30, 20, 10,
      ]);
      assert.deepEqual(sc.mirror1(new Float32Array(array)), new Float32Array([
        0, 10, 20, 30, 40, 20, 40, 60, 40, 20, 40, 30, 20, 10,
      ]));
    });
  });
  describe("mirror2(array)", () => {
    it("works", () => {
      assert.deepEqual(sc.mirror2(array), [
        0, 10, 20, 30, 40, 20, 40, 60, 60, 40, 20, 40, 30, 20, 10, 0,
      ]);
      assert.deepEqual(sc.mirror2(new Float32Array(array)), new Float32Array([
        0, 10, 20, 30, 40, 20, 40, 60, 60, 40, 20, 40, 30, 20, 10, 0,
      ]));
    });
  });
  describe("normalize(array, min, max)", () => {
    it("works", () => {
      let result1 = sc.normalize(array);

      assert(closeTo(result1[0], 0, 1e-6));
      assert(closeTo(result1[1], 0.16666666666667, 1e-6));
      assert(closeTo(result1[2], 0.33333333333333, 1e-6));
      assert(closeTo(result1[3], 0.5, 1e-6));
      assert(closeTo(result1[4], 0.66666666666667, 1e-6));
      assert(closeTo(result1[5], 0.33333333333333, 1e-6));
      assert(closeTo(result1[6], 0.66666666666667, 1e-6));
      assert(closeTo(result1[7], 1, 1e-6));

      let result2 = sc.normalize(array, 69, 81);

      assert.deepEqual(result2, [ 69, 71, 73, 75, 77, 73, 77, 81 ]);

      let result3 = sc.normalize(new Float32Array(array), 69, 81);

      assert.deepEqual(result3, new Float32Array([ 69, 71, 73, 75, 77, 73, 77, 81 ]));
    });
  });
  describe("scramble(array, randomAPI)", () => {
    it("works", () => {
      config.randSeed(12345);

      assert.deepEqual(sc.scramble(array), [ 20, 40, 0, 40, 30, 60, 10, 20 ]);
      assert.deepEqual(sc.scramble(array), [ 20, 10, 40, 20, 30, 60, 40, 0 ]);
      assert.deepEqual(sc.scramble(array), [ 20, 0, 20, 40, 40, 30, 10, 60 ]);
      assert.deepEqual(sc.scramble(array), [ 20, 10, 40, 20, 40, 0, 60, 30 ]);

      let randomAPI = randSeed([ 0.1, 0.6, 0.7, 0.4, 0.8 ]);

      assert.deepEqual(sc.scramble(array, randomAPI), [ 0, 20, 40, 10, 60, 30, 40, 20 ]);
      assert.deepEqual(sc.scramble(array, randomAPI), [ 20, 30, 40, 10, 20, 60, 40, 0 ]);
    });
  });
  describe("wrapAt(array, index)", () => {
    it("works", () => {
      assert(sc.wrapAt(array, -9) === 60);
      assert(sc.wrapAt(array, -8) === 0);
      assert(sc.wrapAt(array, -7) === 10);
      assert(sc.wrapAt(array, -6) === 20);
      assert(sc.wrapAt(array, -5) === 30);
      assert(sc.wrapAt(array, -4) === 40);
      assert(sc.wrapAt(array, -3) === 20);
      assert(sc.wrapAt(array, -2) === 40);
      assert(sc.wrapAt(array, -1) === 60);
      assert(sc.wrapAt(array, 0) === 0);
      assert(sc.wrapAt(array, 1) === 10);
      assert(sc.wrapAt(array, 2) === 20);
      assert(sc.wrapAt(array, 3) === 30);
      assert(sc.wrapAt(array, 4) === 40);
      assert(sc.wrapAt(array, 5) === 20);
      assert(sc.wrapAt(array, 6) === 40);
      assert(sc.wrapAt(array, 7) === 60);
      assert(sc.wrapAt(array, 8) === 0);
      assert(sc.wrapAt(array, 9) === 10);
      assert(sc.wrapAt(array, 10) === 20);
      assert(sc.wrapAt(array, 11) === 30);
      assert(sc.wrapAt(array, 12) === 40);
      assert(sc.wrapAt(array, 13) === 20);
      assert(sc.wrapAt(array, 14) === 40);
      assert(sc.wrapAt(array, 15) === 60);
      assert(sc.wrapAt(array, 16) === 0);
      assert(sc.wrapAt(array, 17) === 10);
      assert(sc.wrapAt(array, 18) === 20);
      assert(sc.wrapAt(array, 19) === 30);
      assert(sc.wrapAt(array, 20) === 40);
    });
  });
  describe("wrapExpand(array, length)", () => {
    it("works", () => {
      assert.deepEqual(sc.wrapExpand(array, 20), [
        0, 10, 20, 30, 40, 20, 40, 60, 0, 10, 20, 30, 40, 20, 40, 60, 0, 10, 20, 30,
      ]);
      assert.deepEqual(sc.wrapExpand(new Float32Array(array), 20), new Float32Array([
        0, 10, 20, 30, 40, 20, 40, 60, 0, 10, 20, 30, 40, 20, 40, 60, 0, 10, 20, 30,
      ]));
    });
  });
});
