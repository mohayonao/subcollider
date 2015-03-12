"use strict";

import assert from "power-assert";
import config from "../src/config";
import * as sc from "../src/array";
import SCRandom from "../src/random";

describe("sc.array", () => {
  before(() => {
    config.save();
  });
  after(() => {
    config.restore();
  });
  describe("scamble(array)", () => {
    it("works", () => {
      config.randomAPI = new SCRandom(10000).random;

      assert.deepEqual(sc.scramble([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]), [ 1, 6, 3, 9, 8, 0, 7, 2, 5, 4 ]);
    });
  });
});
