var sc = require("..");
var assert = require("chai").assert;

describe("Pattern", function() {
    it("Pser", function() {
        var p = new sc.Pser([1,2,3], 8, 2);
        assert.equal(p.next(), 3);
        assert.equal(p.next(), 1);
        assert.equal(p.next(), 2);
        assert.equal(p.next(), 3);
        assert.equal(p.next(), 1);
        assert.equal(p.next(), 2);
        assert.equal(p.next(), 3);
        assert.equal(p.next(), 1);
        assert.equal(p.next(), null);
        assert.equal(p.next(), null);
    });
    it("Pseq", function() {
        var p = new sc.Pseq([1,2,3], 2, 2);
        assert.equal(p.next(), 3);
        assert.equal(p.next(), 1);
        assert.equal(p.next(), 2);
        assert.equal(p.next(), 3);
        assert.equal(p.next(), 1);
        assert.equal(p.next(), 2);
        assert.equal(p.next(), null);
        assert.equal(p.next(), null);
    });
    it("Pshuf", function() {
        var p = new sc.Pshuf([1,2,3], 8);
        var l = p.list;
        assert.equal(p.next(), l[0]);
        assert.equal(p.next(), l[1]);
        assert.equal(p.next(), l[2]);
        assert.equal(p.next(), l[0]);
        assert.equal(p.next(), l[1]);
        assert.equal(p.next(), l[2]);
        assert.equal(p.next(), l[0]);
        assert.equal(p.next(), l[1]);
        assert.equal(p.next(), null);
        assert.equal(p.next(), null);
    });
    it("Prand", function() {
        var p = new sc.Prand([1,2,3], 8);
        var l = p.list;
        assert.notEqual(l.indexOf(p.next()), -1);
        assert.notEqual(l.indexOf(p.next()), -1);
        assert.notEqual(l.indexOf(p.next()), -1);
        assert.notEqual(l.indexOf(p.next()), -1);
        assert.notEqual(l.indexOf(p.next()), -1);
        assert.notEqual(l.indexOf(p.next()), -1);
        assert.notEqual(l.indexOf(p.next()), -1);
        assert.notEqual(l.indexOf(p.next()), -1);
        assert.equal(l.indexOf(p.next()), -1);
        assert.equal(l.indexOf(p.next()), -1);
    });
    it("Pseries", function() {
        var p = new sc.Pseries(3, 2, 8);
        assert.equal(p.next(), 3);
        assert.equal(p.next(), 5);
        assert.equal(p.next(), 7);
        assert.equal(p.next(), 9);
        assert.equal(p.next(), 11);
        assert.equal(p.next(), 13);
        assert.equal(p.next(), 15);
        assert.equal(p.next(), 17);
        assert.equal(p.next(), null);
        assert.equal(p.next(), null);
    });
    it("Pgeom", function() {
        var p = new sc.Pgeom(3, 2, 8);
        assert.equal(p.next(), 3);
        assert.equal(p.next(), 6);
        assert.equal(p.next(), 12);
        assert.equal(p.next(), 24);
        assert.equal(p.next(), 48);
        assert.equal(p.next(), 96);
        assert.equal(p.next(), 192);
        assert.equal(p.next(), 384);
        assert.equal(p.next(), null);
        assert.equal(p.next(), null);
    });
});
