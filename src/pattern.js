(function(sc) {
  "use strict";

  // ##### utility functions
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

  // ## Pser : Pattern
  function Pser(list, repeats, offset) {
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

  // ## Pseq : Pser
  function Pseq(list, repeats, offset) {
    Pser.call(this, list, repeats, offset);
    this.repeats *= list.length;
  }
  extend(Pseq, Pser);
  sc.Pseq = Pseq;

  // ## Pshuf : Pser
  function Pshuf(list, repeats, seed) {
    Pser.call(this, list, repeats, 0);
    var rand = new sc.RGen(seed);
    this.list.sort(function() {
      return rand.next() - 0.5;
    });
  }
  extend(Pshuf, Pser);
  sc.Pshuf = Pshuf;

  // ## Prand : Pattern
  function Prand(list, repeats, seed) {
    Pser.call(this, list, repeats, 0);
    var rand = new sc.RGen(seed);
    this._rand = rand.next.bind(rand);
  }
  extend(Prand, Pattern);

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

  // ## Pseries : Pattern
  function Pseries(start, step, length) {
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

  // ## Pgeom : Pattern
  function Pgeom(start, grow, length) {
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
