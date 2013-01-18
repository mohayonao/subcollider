var sc = require("..");
var assert = require("chai").assert;

function test_converter(name, data, expects, args) {
    it("." + name + "()", function() {
        var func = sc[name];
        var i, x;
        if (!args) args = [];
        
        args.unshift(undefined);
        assert.isUndefined(func.apply(null, args));
        
        for (i = 0; i < data.length; i++) {
            args[0] = data[i];
            x = func.apply(null, args);
            if (isNaN(x)) {
                assert.isTrue(isNaN(expects[i]), data[i] + " should be NaN");
            } else if (x === Infinity || x === -Infinity) {
                assert.equal(x, expects[i], data[i]);
            } else {
                assert.closeTo(x, expects[i], 1e-6, data[i] + " should close to " + expects[i]);
            }
        }
        args[0] = [];
        assert.deepEqual(func.apply(null, args), []);
        
        args[0] = data;
        var actuals = func.apply(null, args);
        for (i = 0; i < actuals.length; i++) {
            x = actuals[i];
            if (isNaN(x)) {
                assert.isTrue(isNaN(expects[i]), "[" + data[i] + "] should be NaN");
            } else if (x === Infinity || x === -Infinity) {
                assert.equal(x, expects[i]);
            } else {
                assert.closeTo(x, expects[i], 1e-6);
            }
        }
    });
}

function test_at(name, data, expects) {
    it("." + name + "()", function() {
        var func = sc[name];
        var indices = [];
        for (var i = -20; i < 30; i++) {
            assert.equal(func(data, i), expects[i + 20], "index:" + i);
            indices.push(i);
        }
        assert.deepEqual(func(data, indices), expects);
    });
}


describe("sc", function() {

    test_converter(
        "midicps", 
        [ -1, 0, 1, 57, 68, 69, 70, 81, 127, 128],
        [ 7.7169265821269, 8.1757989156437, 8.6619572180273, 220, 415.30469757995, 440, 466.16376151809, 880, 12543.853951416, 13289.750322558 ]
    );
    test_converter(
        "cpsmidi",
        [ -10, 0, 10, 110, 210, 220, 230, 440, 7040 ],
        [ 3.4868205763524, -Infinity, 3.4868205763524, 45, 56.194629649698, 57, 57.769564049037, 69, 117 ]    
    );
    test_converter(
        "midiratio",
        [ -1, 0, 1, 57, 68, 69, 70, 81, 127, 128],
        [ 0.94387431268191, 1, 1.0594630943591, 26.908685287764, 50.796833662184, 53.81737057538, 57.01751796006, 107.63474115046, 1534.2664466767, 1625.4986771674 ]
    );
    test_converter(
        "ratiomidi",
        [ -10, 0, 10, 110, 210, 220, 230, 440, 7040 ],
        [ 39.863137138648, -Infinity, 39.863137138648, 81.376316562296, 92.570946211993, 93.376316562296, 94.145880611333, 105.3763165623, 153.3763165623 ]
    );
    test_converter(
        "ampdb",
        [ -1, 0, 0.5, 1, 2, 4, 100 ],
        [ NaN, -Infinity, -6.0205999132796, 0, 6.0205999132796, 12.041199826559, 40 ]
    );
    test_converter(
        "dbamp",
        [ -100, -10, -6, 0, 0.5, 1, 2, 6, 100 ],
        [ 1e-05, 0.31622776601684, 0.50118723362727, 1, 1.0592537251773, 1.122018454302, 1.2589254117942, 1.9952623149689, 100000 ]
    );
    test_converter(
        "octcps",
        [ -5, -4.75, -1, 0, 1, 4.75, 5 ],
        [ 0.51098743222773, 0.60766989008219, 8.1757989156437, 16.351597831287, 32.703195662575, 440, 523.2511306012 ]
    );
    test_converter(
        "cpsoct",
        [ -500, -440, -55, 0, 55, 440, 500 ],
        [ 4.9344245711201, 4.7499999999827, 1.7499999999827, -Infinity, 1.7499999999827, 4.7499999999827, 4.9344245711201 ]
    );
    test_converter(
        "clip",
        [ -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5 ],
        [ 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3 ],
        [ 1, 3 ]
    );
    test_converter(
        "wrap",
        [ -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5 ],
        [ 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2 ],
        [ 1, 3 ]
    );
    test_converter(
        "fold",
        [ -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5 ],
        [ 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1 ],
        [ 1, 3 ]
    );
    it("mulAdd", function() {
        assert.equal(sc.mulAdd(10, 2, 3), 23);
    });
    describe("Array", function() {
        it("sc.fill()", function() {
            var a = sc.fill(10, 1);
            assert.deepEqual(a, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        });
        it("sc.fill() with function", function() {
            var a = sc.fill(10, function(i) {
                return i * 2;
            });
            assert.deepEqual(a, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]);
        });
        it("sc.series()", function() {
            var a = sc.series(5);
            assert.deepEqual(a, [ 0, 1, 2, 3, 4 ]);
        });
        it("sc.series(...)", function() {
            var a = sc.series(5, -6, 3);
            assert.deepEqual(a, [ -6, -3, 0, 3, 6 ]);
        });
        it("sc.geom()", function() {
            var a = sc.geom(5);
            assert.deepEqual(a, [ 1, 2, 4, 8, 16 ]);
        });
        it("sc.geom(...)", function() {
            var a = sc.geom(5, -11, 3);
            assert.deepEqual(a, [ -11, -33, -99, -297, -891 ]);
        });
        
        test_at(
            "at",
            [0,1,2,3,4,5,6,7,8,9],
            [undefined,undefined,undefined,undefined,undefined,
             undefined,undefined,undefined,undefined,undefined,
             undefined,undefined,undefined,undefined,undefined,
             undefined,undefined,undefined,undefined,undefined,
             0,1,2,3,4,5,6,7,8,9,
             undefined,undefined,undefined,undefined,undefined,
             undefined,undefined,undefined,undefined,undefined,
             undefined,undefined,undefined,undefined,undefined,
             undefined,undefined,undefined,undefined,undefined]
        );
        test_at(
            "clipAt",
            [0,1,2,3,4,5,6,7,8,9],
            [0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,
             0,1,2,3,4,5,6,7,8,9,
             9,9,9,9,9,9,9,9,9,9,
             9,9,9,9,9,9,9,9,9,9]
        );
        test_at(
            "wrapAt",
            [0,1,2,3,4,5,6,7,8,9],
            [0,1,2,3,4,5,6,7,8,9,
             0,1,2,3,4,5,6,7,8,9,
             0,1,2,3,4,5,6,7,8,9,
             0,1,2,3,4,5,6,7,8,9,
             0,1,2,3,4,5,6,7,8,9]
        );
        test_at(
            "foldAt",
            [0,1,2,3,4,5,6,7,8,9],
            [2,1,0,1,2,3,4,5,6,7,
             8,9,8,7,6,5,4,3,2,1,
             0,1,2,3,4,5,6,7,8,9,
             8,7,6,5,4,3,2,1,0,1,
             2,3,4,5,6,7,8,9,8,7]
        );

        it(".first()", function() {
            assert.equal(sc.first([0,1,2,3,4,5,6,7,8,9]), 0);
            assert.equal(sc.first([]), undefined);
        });
        it(".last()", function() {
            assert.equal(sc.last([0,1,2,3,4,5,6,7,8,9]), 9);
            assert.equal(sc.last([]), undefined);
        });
        it(".add()", function() {
            var a = [1,2,3,4];
            assert.equal(
                sc.add(a, 5), a
            );
            assert.deepEqual(
                a, [ 1, 2, 3, 4, 5 ]
            );
        });
        it(".addAll()", function() {
            var a = [1,2,3,4];
            assert.equal(
                sc.addAll(a, [5, 6]), a
            );
            assert.deepEqual(
                a, [ 1, 2, 3, 4, 5, 6 ]
            );
        });
        it(".insert()", function() {
            var a = [1,2,3,4];
            assert.equal(
                sc.insert(a, 3, 10), a
            );
            assert.deepEqual(
                a, [ 1, 2, 3, 10, 4 ]
            );
            assert.deepEqual(
                sc.insert(a, -2, 100),
                [ 100, 1, 2, 3, 10, 4 ]
            );
            assert.deepEqual(
                sc.insert(a, 100, 1000),
                [ 100, 1, 2, 3, 10, 4,1000 ]
            );
        });
        it(".removeAt()", function() {
            var a = [1,2,3,4,5];
            assert.equal(
                sc.removeAt(a, 3), 4
            );
            assert.deepEqual(
                a, [ 1, 2, 3, 5 ]
            );
        });
        it(".takeAt()", function() {
            var a = [1,2,3,4,5];
            assert.equal(
                sc.takeAt(a, 2), 3
            );
            assert.deepEqual(
                a, [ 1, 2, 5, 4 ]
            );
        });
        it(".remove()", function() {
            var a = [1,2,3,4];
            assert.equal(
                sc.remove(a, 1), 1
            );
            assert.deepEqual(
                a, [2,3,4]
            );
        });
        it(".take()", function() {
            var a = [1,2,3,4];
            assert.equal(
                sc.take(a, 1), 1
            );
            assert.deepEqual(
                a, [4,2,3]
            );
        });
        it(".put()", function() {
            var a = [1,2,3,4];
            assert.equal(
                sc.put(a, 1, 10), a
            );
            assert.deepEqual(
                a, [1,10,3,4]
            );
            sc.put(a, 100, -1);
            assert.deepEqual(
                a, [1,10,3,4]
            );
            sc.put(a, [-1,0,1,98], 0);
            assert.deepEqual(
                a, [0,0,3,4]
            );
        });
        it(".clipPut()", function() {
            var a = [1,2,3,4];
            assert.equal(
                sc.clipPut(a, 5, 10), a
            );
            assert.deepEqual(
                a, [1,2,3,10]
            );
            sc.clipPut(a, [-1,0,1,98], 0);
            assert.deepEqual(
                a, [0,0,3,0]
            );
        });
        it(".wrapPut()", function() {
            var a = [1,2,3,4];
            assert.equal(
                sc.wrapPut(a, 5, 10), a
            );
            assert.deepEqual(
                a, [1,10,3,4]
            );
            sc.wrapPut(a, [-1,98], 0);
            assert.deepEqual(
                a, [1,10,0,0]
            );
        });
        it(".foldPut()", function() {
            var a = [1,2,3,4];
            assert.equal(
                sc.foldPut(a, 6, 10), a
            );
            assert.deepEqual(
                a, [10,2,3,4]
            );
            sc.foldPut(a, [0,98], 0);
            assert.deepEqual(
                a, [0,2,0,4]
            );
        });
        it(".putFirst()", function() {
            var a = [1,2,3,4];
            assert.equal(
                sc.putFirst(a, 10), a
            );
            assert.deepEqual(
                a, [10,2,3,4]
            );
            assert.deepEqual(
                sc.putFirst([], 10), []
            );
        });
        it(".putLast()", function() {
            var a = [1,2,3,4];
            assert.equal(
                sc.putLast(a, 10), a
            );
            assert.deepEqual(
                a, [1,2,3,10]
            );
            assert.deepEqual(
                sc.putLast([], 10), []
            );
        });
        it(".swap()", function() {
            var a = [1,2,3,4];
            assert.equal(
                sc.swap(a, 1, 3), a
            );
            assert.deepEqual(
                a, [1,4,3,2]
            );
        });
        it(".includes()", function() {
            var a = [1,2,3,4];
            assert.equal(
                sc.includes(a, 1), true
            );
            assert.equal(
                sc.includes(a, 5), false
            );
        });
        it(".indexOfGreaterThan()", function() {
            var a = [10,20,30,40];
            assert.equal(
                sc.indexOfGreaterThan(a, 15), 1
            );
        });
        it(".indexIn()", function() {
            var a = [10,20,30,40];
            assert.equal(
                sc.indexIn(a, 14), 0
            );
            assert.equal(
                sc.indexIn(a, 15), 1
            );
        });
        it(".indexInBetween()", function() {
            var a = [10,20,30,40];
            assert.closeTo(
                sc.indexInBetween(a, 14), 0.4, 1e-6
            );
            assert.closeTo(
                sc.indexInBetween(a, 15), 0.5, 1e-6
            );
        });
        it(".find()", function() {
            var a = [10,20,30,40,20];
            assert.equal(
                sc.find(a, [20,30]), 1
            );
            assert.equal(
                sc.find(a, [20,30], 2), -1
            );
            assert.equal(
                sc.find(a, [20,30,50]), -1
            );
        });
        it(".findAll()", function() {
            var a = [10,20,30,40,20,30,20];
            assert.deepEqual(
                sc.findAll(a, [20,30]), [1,4]
            );
            assert.deepEqual(
                sc.findAll(a, [20,30], 2), [4]
            );
        });
        it(".indicesOfEqual()", function() {
            var a = [10,20,30,40,20,30,20];
            assert.deepEqual(
                sc.indicesOfEqual(a, 20), [1,4,6]
            );
        });
        it(".copyRange()", function() {
            var a = [10,20,30,40,20,30,20];
            assert.deepEqual(
                sc.copyRange(a, 2, 4), [30,40,20]
            );
            assert.deepEqual(
                sc.copyRange(a, 2, 99), [30,40,20,30,20]
            );
        });
        it(".copyToEnd()", function() {
            var a = [10,20,30,40,20,30,20];
            assert.deepEqual(
                sc.copyToEnd(a, 2), [30,40,20,30,20]
            );
        });
        it(".copyFromStart()", function() {
            var a = [10,20,30,40,20,30,20];
            assert.deepEqual(
                sc.copyFromStart(a, 2), [10,20,30]
            );
        });
        it(".keep()", function() {
            var a = [10,20,30,40,20,30,20];
            assert.deepEqual(
                sc.keep(a, 2), [10,20]
            );
            assert.deepEqual(
                sc.keep(a, -2), [30,20]
            );
        });
        it(".drop()", function() {
            var a = [10,20,30,40,20,30,20];
            assert.deepEqual(
                sc.drop(a, 2), [30,40,20,30,20]
            );
            assert.deepEqual(
                sc.drop(a, -2), [10,20,30,40,20]
            );
        });
        it(".scramble()", function() {
            var a = [10,20,30,40,20,30,20];
            assert.notEqual(
                sc.scramble(a), a
            );
        });
        it(".mirror()", function() {
            var a = [ 1, 2, 3, 4 ];
            assert.deepEqual(
                sc.mirror(a), [ 1, 2, 3, 4, 3, 2, 1 ]
            );
        });
        it(".mirror1()", function() {
            var a = [ 1, 2, 3, 4 ];
            assert.deepEqual(
                sc.mirror1(a), [ 1, 2, 3, 4, 3, 2 ]
            );
        });
        it(".mirror2()", function() {
            var a = [ 1, 2, 3, 4 ];
            assert.deepEqual(
                sc.mirror2(a), [ 1, 2, 3, 4, 4, 3, 2, 1 ]
            );
        });
        it(".stutter()", function() {
            var a = [ 1, 2, 3, 4 ];
            assert.deepEqual(
                sc.stutter(a, 3), [ 1,1,1, 2,2,2, 3,3,3, 4,4,4 ]
            );
        });
        it(".rotate()", function() {
            var a = [ 1, 2, 3 ];
            assert.deepEqual(
                sc.rotate(a, 1), [ 3, 1, 2 ]
            );
            assert.deepEqual(
                sc.rotate(a,-1), [ 2, 3, 1 ]
            );
        });
        it(".lace()", function() {
            var a = [[1,2,3], 0];
            assert.deepEqual(
                sc.lace(a, 7), [ 1, 0, 2, 0, 3, 0, 1 ]
            );
        });
        it(".extend()", function() {
            var a = [ 1, 2, 3, 4 ];
            assert.deepEqual(
                sc.extend(a, 6, 0),
                [ 1, 2, 3, 4, 0, 0 ]
            );
        });
        it(".clipExtend()", function() {
            var a = [ 1, 2, 3, 4 ];
            assert.deepEqual(
                sc.clipExtend(a, 6),
                [ 1, 2, 3, 4, 4, 4 ]
            );
        });
        it(".wrapExtend()", function() {
            var a = [ 1, 2, 3, 4 ];
            assert.deepEqual(
                sc.wrapExtend(a, 6),
                [ 1, 2, 3, 4, 1, 2 ]
            );
        });
        it(".foldExtend()", function() {
            var a = [ 1, 2, 3, 4 ];
            assert.deepEqual(
                sc.foldExtend(a, 6),
                [ 1, 2, 3, 4, 3, 2 ]
            );
        });
        it(".choose()", function() {
            var a = [ 0, 1, 2, 3, 4 ];
            assert.isTrue(
                a.indexOf(sc.choose(a)) !== -1
            );
        });        
        it(".wchoose()", function() {
            var a = [ 0, 1, 2, 3, 4 ];
            assert.isTrue(
                a.indexOf(sc.wchoose(a, [ 0.1, 0.2, 0.3, 0.4 ])) !== -1
            );
        });
        it(".performDegreeToKey()", function() {
            var a = [1,2,3,4,5];
            assert.equal(sc.performDegreeToKey(a, 1), 2);
            assert.equal(sc.performDegreeToKey(a, 6), 14);
            assert.equal(sc.performDegreeToKey(a, 6, 8), 10);
            assert.closeTo(sc.performDegreeToKey(a, 6, 8, 2), 11.333333333333, 1e-6);
        });
        it(".performKeyToDegree()", function() {
            var a = [1,2,3,4,5];
            assert.equal(sc.performKeyToDegree(a, 6), 4);
            assert.equal(sc.performKeyToDegree(a, 6, 2), 15);
        });
        it(".equals()", function() {
            assert.isTrue(
                sc.equals([10], [10])
            );
            assert.isFalse(
                sc.equals([10], [20])
            );
            assert.isTrue(
                sc.equals([10, [20]], [10, [20]])
            );
            assert.isTrue(
                sc.equals([10, [20, [30]]], [10, [20, [30]]])
            );
        });
    });        
});
