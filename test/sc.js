"use strict";

import assert from "power-assert";
import sc from "../src/sc";

describe("sc", () => {
  before(() => {
    sc.addFunction("neg", (a) => {
      return -a;
    }, { expandToArray: true });
    sc.addFunction("add", (a, b) => {
      return a + b;
    }, { category: "number", expandToArray: true });
    sc.addFunction("mul", (a, b) => {
      return a * b;
    }, { category: "number", expandToArray: true });
    sc.addFunction("at", (array, index) => {
      return array[index];
    }, { category: "array" });
  });
  after(() => {
    sc.removeFunction("neg");
    sc.removeFunction("add");
    sc.removeFunction("mul");
    sc.removeFunction("at");
  });
  describe("sc(value: any): SC", () => {
    it("works", () => {
      assert(sc(1).add(2).mul(3).neg().value() ===  -9);
      assert(sc(2).add(2).mul(3).neg().value() === -12);
      assert(sc(3).add(2).mul(3).neg().value() === -15);
      assert(sc([ 1, 2, 3 ]).neg().at(1).value() === -2);
      assert.deepEqual(sc([ 1, 2, 3 ]).add(2).mul(3).neg().value(), [ -9, -12, -15 ]);
      assert.deepEqual(sc(1).add(2).mul([ 3, 4, 5 ]).neg().value(), [ -9, -12, -15 ]);
      assert.deepEqual(sc([ 1, 2, 3 ]).neg().at([ 1, 2, 0 ]).value(), [ -2, -3, -1 ]);
    });
  });
  describe("sc.method(value: any, ...args: any): any", () => {
    it("works", () => {
      assert(sc.add(1, 2) === 3);
      assert(sc.at([ 1, 2, 3 ], 1) === 2);
      assert.deepEqual(sc.add(1, [ 2 ]), [ 3 ]);
      assert.deepEqual(sc.add(1, [ 2, 3 ]), [ 3, 4 ]);
      assert.deepEqual(sc.at([ 1, 2, 3 ], [ 1 ]), [ 2 ]);
      assert.deepEqual(sc.at([ 1, 2, 3 ], [ 1, 2, 0 ]), [ 2, 3, 1 ]);
    });
  });
});
