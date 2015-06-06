import assert from "power-assert";
import SCRandom from "../src/SCRandom";

function closeTo(expected, actual, delta) {
  return Math.abs(expected - actual) <= delta;
}

describe("SCRandom", () => {
  describe("constructor([ seed: number ])", () => {
    it("should return an instance of SCRandom", () => {
      let rand = new SCRandom();

      assert(rand instanceof SCRandom);
      assert(typeof rand.random === "function");
    });
  });
  describe("#random(): number", () => {
    it("works", () => {
      let rand1 = new SCRandom(1679284208);
      let rand2 = new SCRandom(1679284208);
      let rand3 = new SCRandom(1821773524);
      let rand4 = new SCRandom(1821773524);

      assert(rand1.random() === rand2.random());
      assert(rand1.random() === rand2.random());
      assert(rand1.random() === rand2.random());
      assert(rand3.random() === rand4.random());
      assert(rand3.random() === rand4.random());
      assert(rand3.random() === rand4.random());
      assert(rand1.random() !== rand3.random());
      assert(rand1.random() !== rand3.random());
      assert(rand1.random() !== rand3.random());
    });
    it("works", () => {
      let rand = new SCRandom(10000);

      assert(closeTo(rand.random(), 0.1669164896011, 1e-6));
      assert(closeTo(rand.random(), 0.6516681909561, 1e-6));
      assert(closeTo(rand.random(), 0.1753853559494, 1e-6));
    });
  });
});
