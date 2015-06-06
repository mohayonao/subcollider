import assert from "power-assert";
import config from "../src/config";

describe("config", () => {
  describe("save() / restore()", () => {
    let rand1 = Math.random.bind(Math);
    let rand2 = Math.random.bind(Math);

    it("works", () => {
      config.sampleRate = 44100;
      config.randomAPI = rand1;

      config.save();

      assert(config.sampleRate === 44100, "saved");
      assert(config.randomAPI === rand1, "saved");

      config.sampleRate = 22050;
      config.randomAPI = rand2;

      assert(config.sampleRate === 22050);
      assert(config.randomAPI === rand2);

      config.restore();

      assert(config.sampleRate === 44100, "restored");
      assert(config.randomAPI === rand1, "restored");

      config.restore();

      assert(config.sampleRate === 44100, "restored 2");
      assert(config.randomAPI === rand1, "restored 2");
    });
  });
});
