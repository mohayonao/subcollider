import SCRandom from "./SCRandom";

let stack = [];

function assign(src, dst) {
  Object.keys(src).forEach((key) => {
    dst[key] = src[key];
  });
}

function clone(src) {
  let dst = {};

  assign(src, dst);

  return dst;
}

//// # Config
//// ## sc.config
//// - `baseFreq` _(number)_: The default value is `440`.
//// - `sampleRate` _(number)_: The default value is `44100`.
//// - `randomAPI` _(function)_: The default value is `Math.random`.
////
//// ## sc.config.save()
//// Saves the entire state of the `sc.config` by pushing the current state onto a stack.
////
//// ## sc.config.restore()
//// Restores the most recently saved `sc.config` state by popping the top entry in the state stack. If there is no saved state, this method does nothing.
////
//// ```js
//// sc.config.baseFreq; // => 440
//// sc.midicps(81);     // => 880
////
//// sc.config.save();
////
//// sc.config.baseFreq = 442
//// sc.midicps(81); // => 884
////
//// sc.config.restore();
////
//// sc.config.baseFreq; // => 440
//// sc.midicps(81);     // => 880
//// ```
export class SCConfig {
  constructor() {
    this.baseFreq = 440;
    this.sampleRate = 44100;
    this.randomAPI = Math.random;
  }

  save() {
    stack.push(clone(this));
  }

  restore() {
    if (stack.length) {
      assign(stack.pop(), this);
    }
  }

  randSeed(seed) {
    this.randomAPI = new SCRandom(seed).random;
  }
}

export default new SCConfig();
