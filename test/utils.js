import assert from "power-assert";
import * as utils from "../src/utils";

let undef;

describe("utils", () => {
  describe("defaults(value: any, defaultValue: any): any", () => {
    it("should return defaultValue when given undefined", () => {
      assert(utils.defaults(0, 1) === 0);
      assert(utils.defaults(null, 1) === null);
      assert(utils.defaults(false, 1) === false);
      assert(utils.defaults("", 1) === "");
      assert(isNaN(utils.defaults(NaN, 1)));
      assert(utils.defaults(undef, 1) === 1);
    });
  });
});
