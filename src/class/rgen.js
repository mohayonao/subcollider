(function(sc) {
  "use strict";

  /**
   * @name *RGen
   * @description
   * Random Generator
   * @arguments _([seed])_
   * @example
   *  r = sc.RGen();
   *  r.next();
   */
  function RGen(seed) {
    if (!(this instanceof RGen)) {
      return new RGen(seed);
    }
    if (typeof seed !== "number") {
      seed = Date.now();
    }
    var hash = seed;
    hash += ~(hash <<  15);
    hash ^=   hash >>> 10;
    hash +=   hash <<  3;
    hash ^=   hash >>> 6;
    hash += ~(hash <<  11);
    hash ^=   hash >>> 16;

    this.s1 = 1243598713 ^ seed;
    this.s2 = 3093459404 ^ seed;
    this.s3 = 1821928721 ^ seed;
    if (this.s1 <  2) { this.s1 = 1243598713; }
    if (this.s2 <  8) { this.s2 = 3093459404; }
    if (this.s3 < 16) { this.s3 = 1821928721; }
  }

  RGen.prototype.trand = function() {
    this.s1 = ((this.s1 & 4294967294) << 12) ^ (((this.s1 << 13) ^  this.s1) >>> 19);
    this.s2 = ((this.s2 & 4294967288) <<  4) ^ (((this.s2 <<  2) ^  this.s2) >>> 25);
    this.s3 = ((this.s3 & 4294967280) << 17) ^ (((this.s3 <<  3) ^  this.s3) >>> 11);
    return this.s1 ^ this.s2 ^ this.s3;
  };

  var _i = new Uint32Array(1);
  var _f = new Float32Array(_i.buffer);

  /**
   * @name next
   * @description
   * return a number from 0.0 to 0.999...
   * @arguments _none_
   * @example
   *  r = sc.RGen(100);
   *  r.next(); // => 0.6258506774902344
   *  r.next(); // => 0.4134453535079956
   *  r.next(); // => 0.13581514358520508
   */
  RGen.prototype.next = function() {
    _i[0] = 0x3F800000 | (this.trand() >>> 9);
    return _f[0] - 1;
  };

  sc.RGen = RGen;

})(sc);
