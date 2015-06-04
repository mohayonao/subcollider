import assert from "power-assert";
import sinon from "sinon";
import sc from "../src/sc";
import * as sc_ from "../src/sc";

describe("sc", () => {
  let SC = sc_.SC;

  describe("SC", () => {
    describe("(value: any): SC", () => {
      it("should return an instance of SC", () => {
        let x = new SC(10);
        let y = new SC(20);

        assert(x instanceof SC);
        assert(y instanceof SC);
        assert(x !== y);
      });
    });
    describe("#value(): any", () => {
      it("should return value given at created", () => {
        let x = new SC(10);
        let y = new SC(20);

        assert(x.value() === 10);
        assert(y.value() === 20);
      });
    });
  });
  describe("peel(value: any|SC): any", () => {
    let peel = sc_.peel;

    it("should return value given at created when value is SC", () => {
      assert(peel(10) === 10);
      assert(peel(new SC(20)) === 20);
    });
  });
  describe("flop(array: any[]): any[][]", () => {
    let flop = sc_.flop;

    it("should invert rows and columns in a two dimensional array", () => {
      assert.deepEqual(flop([]), [
        [],
      ]);
      assert.deepEqual(flop([ [ 1, 2, 3 ], [ 4, 5, 6 ] ]), [
        [ 1, 4 ],
        [ 2, 5 ],
        [ 3, 6 ],
      ]);
      assert.deepEqual(flop([ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8 ] ]), [
        [ 1, 4, 7 ],
        [ 2, 5, 8 ],
        [ 3, 6, 7 ],
      ]);
      assert.deepEqual(flop([ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8 ], 9 ]), [
        [ 1, 4, 7, 9 ],
        [ 2, 5, 8, 9 ],
        [ 3, 6, 7, 9 ],
      ]);
    });
  });
  describe("defineMethod(target: object, name: string, func: function): void", () => {
    let defineMethod = sc_.defineMethod;

    it("should define new method on a target", () => {
      function X() {}

      function foo() {
        return 100;
      }

      defineMethod(X, "foo", foo);

      assert(X.prototype.foo === foo);
      assert.deepEqual(Object.keys(X), []);

      let x = new X();

      assert(x.foo === foo);
      assert(x.foo() === 100);
    });
  });
  describe("sc(value: any): SC", () => {
    it("should return an instance of SC", () => {
      assert(sc(10) instanceof SC);
    });
    describe(".addFunction(name: string, func: function, opts = {}): void", () => {
      it("should add function to sc and SC.prototype", () => {
        let foo1 = sinon.spy(function(a, b) {
          return a + b;
        });
        let foo2 = sinon.spy(function(a, b) {
          return a * b;
        });
        let foo3 = sinon.spy(function(a, b) {
          return a - b;
        });

        sc.addFunction("foo", foo1);
        assert(typeof sc.foo === "function");
        assert(typeof SC.prototype.foo === "function");

        sc.foo(1, 2, 3);

        assert(foo1.calledOnce);
        assert(foo1.calledWith(1, 2));
        assert(!foo2.called);
        assert(!foo3.called);
        foo1.reset();
        foo2.reset();
        foo3.reset();

        sc.addFunction("foo", foo2);
        sc.foo(1, 2, 3);

        assert(foo1.calledOnce);
        assert(foo1.calledWith(1, 2));
        assert(!foo2.called);
        assert(!foo3.called);
        foo1.reset();
        foo2.reset();
        foo3.reset();

        sc.addFunction("foo", foo2, { override: true });
        sc.foo(1, 2, 3);

        assert(!foo1.called);
        assert(foo2.calledOnce);
        assert(foo2.calledWith(1, 2));
        assert(!foo3.called);
        foo1.reset();
        foo2.reset();
        foo3.reset();

        let x = sc(1);

        x.foo(2, 3);

        assert(!foo1.called);
        assert(foo2.calledOnce);
        assert(foo2.calledWith(1, 2));
        assert(!foo3.called);
        foo1.reset();
        foo2.reset();
        foo3.reset();

        sc.addFunction("foo", foo3, { category: "math", override: true });
        sc.math.foo(1, 2, 3);

        assert(!foo1.called);
        assert(!foo2.called);
        assert(foo3.calledOnce);
        assert(foo3.calledWith(1, 2));
        foo1.reset();
        foo2.reset();
        foo3.reset();

        sc.removeFunction("foo");
      });
    });
    describe(".removeFunction(name: string): void", () => {
      it("should remove function from sc and SC.prototype", () => {
        let foo = sinon.spy(function(a, b) {
          return a + b;
        });

        sc.addFunction("foo1", foo, { category: "math" });
        sc.addFunction("foo2", foo, { category: "math" });
        sc.addFunction("foo2", foo, { category: "math2", override: true });
        sc.addFunction("foo2", foo, { category: "math3", override: true });

        assert(typeof sc.foo1 === "function");
        assert(typeof sc.foo2 === "function");
        assert(typeof SC.prototype.foo1 === "function");
        assert(typeof SC.prototype.foo2 === "function");
        assert(typeof sc.math === "object");
        assert(typeof sc.math.foo1 === "function");
        assert(typeof sc.math.foo2 === "undefined");
        assert(typeof sc.math2 === "undefined");
        assert(typeof sc.math3 === "object");
        assert(typeof sc.math3.foo2 === "function");

        sc.removeFunction("foo1");

        assert(typeof sc.foo1 === "undefined");
        assert(typeof SC.prototype.foo1 === "undefined");
        assert(typeof sc.math === "undefined");
        assert(typeof sc.math3 === "object");
        assert(typeof sc.math3.foo2 === "function");

        sc.removeFunction("foo2");

        assert(typeof sc.foo2 === "undefined");
        assert(typeof SC.prototype.foo2 === "undefined");
        assert(typeof sc.math3 === "undefined");
      });
    });
    describe(".mixin(source = {}, opts = {}): sc", () => {
      it("works", () => {
        let source = {
          foo: sinon.spy(function(a, b) {
            return a / b;
          }),
          bar: "BAR",
        };

        assert(sc.mixin() === sc);
        sc.mixin(source, { override: true });

        assert(typeof sc.foo === "function");
        assert(typeof sc.bar === "undefined");

        sc.removeFunction("foo");
      });
    });
    describe("works", () => {
      before(function() {
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
      after(function() {
        sc.removeFunction("neg");
        sc.removeFunction("add");
        sc.removeFunction("mul");
        sc.removeFunction("at");
      });
      it("sc.function(...args: any): any", () => {
        assert(sc.neg(1) === -1);
        assert(sc.add(1, 2) === 3);
        assert(sc.at([ 1, 2, 3 ], 1) === 2);
        assert.deepEqual(sc.neg([ 1 ]), [ -1 ]);
        assert.deepEqual(sc.neg([ 1, [ 2 ] ]), [ -1, [ -2 ] ]);
        assert.deepEqual(sc.neg([ 1, [ 2, [ 3 ] ] ]), [ -1, [ -2, [ -3 ] ] ]);
        assert.deepEqual(sc.add(1, [ 2 ]), [ 3 ]);
        assert.deepEqual(sc.add([ 1 ], 2), [ 3 ]);

        let a, b, c;

        a = 1;
        b = [ 10, [ 100, [ 1000 ] ] ];
        c = [ 11, [ 101, [ 1001 ] ] ];
        assert.deepEqual(sc.add(a, b), c);

        a = [ 10, [ 100, [ 1000 ] ] ];
        b = [ 1, 2, 3, 4, 5 ];
        c = [ 11, [ 102, [ 1002 ] ], 13, [ 104, [ 1004 ] ], 15 ];
        assert.deepEqual(sc.add(a, b), c);

        a = [ 10, [ 100, [ 1000 ] ] ];
        b = [ 1, 2, [ 3, [ 4, 5 ] ] ];
        c = [ 11, [ 102, [ 1002 ] ], [ 13, [ 14, 15 ] ] ];
        assert.deepEqual(sc.add(a, b), c);

        a = [ 10, 100, 1000 ];
        b = [ 2, 3, [ 4, [ 5, 6 ] ] ];
        c = [ 12, 103, [ 1004, [ 1005, 1006 ] ] ];
        assert.deepEqual(sc.add(a, b), c);

        a = [ 1, 2, 3 ];
        b = [ 1 ];
        c = [ 2 ];
        assert.deepEqual(sc.at(a, b), c);

        a = [ 1, 2, 3 ];
        b = [ 1, 2, 0 ];
        c = [ 2, 3, 1 ];
        assert.deepEqual(sc.at(a, b), c);

        a = [ 1, 2, 3 ];
        b = [ 1, [ 2, [ 0 ] ] ];
        c = [ 2, [ 3, [ 1 ] ] ];
        assert.deepEqual(sc.at(a, b), c);
      });
      it("sc(any: value).value()", () => {
        assert(sc(1).add(2).mul(3).neg().value() === -9);
        assert(sc(2).add(2).mul(3).neg().value() === -12);
        assert(sc(3).add(2).mul(3).neg().value() === -15);
        assert(sc([ 1, 2, 3 ]).neg().at(1).value() === -2);
        assert.deepEqual(sc([ 1, 2, [ 3 ] ]).add(2).mul(3).neg().value(), [ -9, -12, [ -15 ] ]);
        assert.deepEqual(sc(1).add(2).mul([ 3, 4, [ 5 ] ]).neg().value(), [ -9, -12, [ -15 ] ]);
        assert.deepEqual(sc([ 1, 2, [ 3 ] ]).neg().at([ 1, 2, [ 0 ] ]).value(), [ -2, [ -3 ], [ -1 ] ]);
      });
    });
  });
});
