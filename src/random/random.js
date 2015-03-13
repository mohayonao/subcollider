"use strict";

/// # sc.Random([ seed: number ])
/// Random generator with a seed. This is implemented based on [SC_RGen.h](https://github.com/supercollider/supercollider/blob/master/include/plugin_interface/SC_RGen.h).
/// ## random()
/// Returns a floating-point random number in the range [0, 1)
/// ### Example
/// ```js
/// var rgen = new sc.Random(10000);
///
/// rgen.random(); // always 0.16691652918234468
/// rgen.random(); // always 0.6516682039946318
/// rgen.random(); // always 0.17538540181703866
///
/// sc.config.randomAPI = rgen.random;
/// sc.coin(0.5); // always false
/// sc.coin(0.5); // always false
/// sc.coin(0.5); // always true
/// ```
export class SCRandom {
  constructor(seed) {
    if (typeof seed !== "number") {
      seed = Date.now();
    }

    seed >>>= 0;
    seed += ~(seed <<  15);
    seed ^=   seed >>> 10;
    seed +=   seed <<  3;
    seed ^=   seed >>> 6;
    seed += ~(seed <<  11);
    seed ^=   seed >>> 16;

    let s1 = (1243598713 ^ seed) >>> 0;
    let s2 = (3093459404 ^ seed) >>> 0;
    let s3 = (1821928721 ^ seed) >>> 0;

    if (s1 <  2) {
      s1 = 1243598713;
    }
    if (s2 <  8) {
      s2 = 3093459404;
    }
    if (s3 < 16) {
      s3 = 1821928721;
    }

    this.random = () => {
      s1 = ((s1 & 4294967294) << 12) ^ (((s1 << 13) ^ s1) >>> 19);
      s2 = ((s2 & 4294967288) <<  4) ^ (((s2 <<  2) ^ s2) >>> 25);
      s3 = ((s3 & 4294967280) << 17) ^ (((s3 <<  3) ^ s3) >>> 11);
      return ((s1 ^ s2 ^ s3) >>> 0) / 4294967296;
    };
  }
}

export default SCRandom;
