(function(sc) {
  "use strict";

  function extend(child, parent) {
    for (var key in parent) {
      if (parent.hasOwnProperty(key)) {
        child[key] = parent[key];
      }
    }
    function Ctor() {
      this.constructor = child;
    }
    Ctor.prototype  = parent.prototype;
    child.prototype = new Ctor();
    child.__super__ = parent.prototype;
    return child;
  }

  // # Pattern
  function Pattern() {
    if (!(this instanceof Pattern)) {
      return new Pattern();
    }
    this.count = 0;
  }
  Pattern.prototype.next = function() {
    return null;
  };
  Pattern.prototype.valueOf = function(item) {
    return (typeof item.next === "function") ? item.next() : item;
  };
  Pattern.prototype.reset = function() {
    this.count = 0;
  };
  sc.Pattern = Pattern;

  /**
   * @name *Pser
   * @description
   * is like `Pseq`, however the repeats variable gives *the number of items* returned instead of the number of complete cycles
   * @arguments _(list [, repeat=1, offset=0])_
   * @example
   *  p = sc.Pser([1,2,3], 4);
   *  p.next(); // => 1
   *  p.next(); // => 2
   *  p.next(); // => 3
   *  p.next(); // => 1
   *  p.next(); // => null
   */
  function Pser(list, repeats, offset) {
    if (!(this instanceof Pser)) {
      return new Pser(list, repeats, offset);
    }
    Pattern.call(this);
    repeats = (typeof repeats === "number") ? repeats : 1;
    offset  = (typeof offset  === "number") ? offset  : 0;

    this.list = list;
    this.repeats = repeats !== Infinity ? Math.max(0, repeats)|0 : Infinity;
    this.offset  = Math.max(0, offset )|0;
  }
  extend(Pser, Pattern);

  Pser.prototype.next = function() {
    if (this.count >= this.repeats) {
      return null;
    }
    var index = (this.count + this.offset) % this.list.length;
    var item  = this.list[index];
    var value = this.valueOf(item);
    if (value !== null) {
      if (typeof item.next !== "function") {
        this.count += 1;
      }
      return value;
    } else {
      if (typeof item.reset === "function") {
        item.reset();
      }
      this.count += 1;
      return this.next();
    }
  };
  sc.Pser = Pser;

  /**
   * @name *Pseq
   * @description
   * Cycles over a list of values. The repeats variable gives the number of times to repeat the entire list.
   * @arguments _(list [, repeat=1, offset=0])_
   * @example
   *  p = sc.Pseq([1,2,3], 2);
   *  p.next(); // => 1
   *  p.next(); // => 2
   *  p.next(); // => 3
   *  p.next(); // => 1
   *  p.next(); // => 2
   *  p.next(); // => 3
   *  p.next(); // => null
   */
  function Pseq(list, repeats, offset) {
    if (!(this instanceof Pseq)) {
      return new Pseq(list, repeats, offset);
    }
    Pser.call(this, list, repeats, offset);
    this.repeats *= list.length;
  }
  extend(Pseq, Pser);
  sc.Pseq = Pseq;

  /**
   * @name *Pshuf
   * @description
   * Returns a shuffled version of the *list* item by item, with n *repeats*.
   * @arguments _(list [, repeats=1, seed=nil])_
   * @example
   *  p = sc.Pshuf([1,2,3], 5, 12345);
   *  p.next(); // => 2
   *  p.next(); // => 1
   *  p.next(); // => 3
   *  p.next(); // => 2
   *  p.next(); // => 1
   *  p.next(); // => null
   */
  function Pshuf(list, repeats, seed) {
    if (!(this instanceof Pshuf)) {
      return new Pshuf(list, repeats, seed);
    }
    Pser.call(this, list, repeats, 0);
    var rand = new sc.RGen(seed);
    this.list.sort(function() {
      return rand.next() - 0.5;
    });
  }
  extend(Pshuf, Pser);
  sc.Pshuf = Pshuf;

  /**
   * @name *Prand
   * @description
   * Embed one item from the list at random for each repeat.
   * @arguments _(list [, repeats=1, seed=nil])_
   * @example
   *  p = sc.Prand([1,2,3], 5, 12345);
   *  p.next(); // => 3
   *  p.next(); // => 1
   *  p.next(); // => 2
   *  p.next(); // => 1
   *  p.next(); // => 3
   *  p.next(); // => null
   */
  function Prand(list, repeats, seed) {
    if (!(this instanceof Prand)) {
      return new Prand(list, repeats, seed);
    }
    Pser.call(this, list, repeats, 0);
    var rand = new sc.RGen(seed);
    this._rand = rand.next.bind(rand);
  }
  extend(Prand, Pser);

  Prand.prototype.next = function() {
    if (this.count >= this.repeats) {
      return null;
    }
    var index = (this._rand() * this.list.length)|0;
    var item  = this.list[index];
    var value = this.valueOf(item);
    if (value !== null) {
      if (typeof item.next !== "function") {
        this.count += 1;
      }
      return value;
    } else {
      if (typeof item.reset === "function") {
        item.reset();
      }
      this.count += 1;
      return this.next();
    }
  };
  sc.Prand = Prand;

  /**
   * @name *Pseries
   * @description
   * Returns a stream that behaves like an arithmetric series.
   * @arguments _([start=0, step=1, length=inf])_
   * @example
   *  p = sc.Pseries(0, 2, 5);
   *  p.next(); // => 0
   *  p.next(); // => 2
   *  p.next(); // => 4
   *  p.next(); // => 6
   *  p.next(); // => 8
   *  p.next(); // => null
   */
  function Pseries(start, step, length) {
    if (!(this instanceof Pseries)) {
      return new Pseries(start, step, length);
    }
    Pattern.call(this);
    start  = (typeof start  === "number") ? start  : 0;
    length = (typeof length === "number") ? length : Infinity;

    this.start  = start;
    this.value  = this.start;
    this.step   = step || 1;
    this.length = length !== Infinity ? Math.max(0, length)|0 : Infinity;
  }
  extend(Pseries, Pattern);

  Pseries.prototype.next = function() {
    if (this.count < this.length) {
      var step = this.valueOf(this.step);
      if (step !== null) {
        var outval = this.value;
        this.value += step;
        this.count += 1;
        return outval;
      }
    }
    return null;
  };
  sc.Pseries = Pseries;

  /**
   * @name *Pgeom
   * @description
   * Returns a stream that behaves like a geometric series.
   * @arguments _([start=0, grow=1, length=inf])_
   * @example
   *  p = sc.Pgeom(1, 2, 5);
   *  p.next(); // => 1
   *  p.next(); // => 2
   *  p.next(); // => 4
   *  p.next(); // => 8
   *  p.next(); // => 16
   *  p.next(); // => null
   */
  function Pgeom(start, grow, length) {
    if (!(this instanceof Pgeom)) {
      return new Pgeom(start, grow, length);
    }
    Pattern.call(this);
    start  = (typeof start  === "number") ? start  : 0;
    length = (typeof length === "number") ? length : Infinity;

    this.start  = start;
    this.value  = this.start;
    this.grow   = grow || 1;
    this.length = length !== Infinity ? Math.max(0, length)|0 : Infinity;
  }
  extend(Pgeom, Pattern);

  Pgeom.prototype.next = function() {
    if (this.count < this.length) {
      var grow = this.valueOf(this.grow);
      if (grow !== null) {
        var outval = this.value;
        this.value *= grow;
        this.count += 1;
        return outval;
      }
    }
    return null;
  };
  sc.Pgeom = Pgeom;

})(sc);
