require "../builds/subcollider.js"

nan = NaN
inf = Infinity

approximate = (a, b, precision=1/10000)->
  if Array.isArray(a)
    if a.length != b.length
      false
    else
      a.every (_, i)->
        ret = approximate a[i], b[i], precision
        if not ret
          console.log i, a[i], b[i]
        ret
  else if isNaN(a) and isNaN(b)
    true
  else if a is Infinity and b is Infinity
    true
  else if a is -Infinity and b is -Infinity
    true
  else
    Math.abs(a - b) < precision

testcase = {}

testcase["sc"] = (test)->
  test.expect 1
  test.ok !!sc
  do test.done

testcase["usage"] = (test)->
  test.expect 8
  test.equal sc.madd(10, 2, 5)   , 10 * 2 + 5
  test.equal 10.madd(2, 5)           , 10 * 2 + 5
  test.equal sc("madd")(10, 2, 5), 10 * 2 + 5
  test.equal sc("madd", 2)(10, 5), 10 * 2 + 5
  test.equal sc("madd", 2, 5)(10), 10 * 2 + 5
  test.equal 10.sc("madd")(2, 5)        , 10 * 2 + 5
  test.equal 10.sc("madd", 2)(5)        , 10 * 2 + 5
  test.equal 10.sc("madd", 2, 5)()      , 10 * 2 + 5
  do test.done

testcase["range"] = (test)->
  test.expect 5
  test.deepEqual sc.Range("1"), [0, 1]
  test.deepEqual sc.Range("1..5"), [1,2,3,4,5]
  test.deepEqual sc.Range("1...5"), [1,2,3,4]
  test.deepEqual sc.Range("1,3..5"), [1,3,5]
  test.deepEqual sc.R("0, 0.1..1"), [0, 0.1, 0.2, 0.30000000000000004, 0.4, 0.5, 0.6, 0.7, 0.7999999999999999, 0.8999999999999999, 0.9999999999999999]
  do test.done  

testcase["RGen"] = (test)->
  test.expect 1
  r = sc.RGen()
  test.ok [0....100000].every -> 0 <= r.next() < 1
  do test.done

testcase["abs"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).abs()
  b = [ 2, 1.6, 1.2, 0.8, 0.4, 0, 0.4, 0.8, 1.2, 1.6 ]
  test.ok approximate a, b
  do test.done

testcase["absdif"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).absdif(-0.1,0.2)
  b = [ 1.9, 1.5, 1.1, 0.7, 0.3, 0.1, 0.5, 0.9, 1.3, 1.7 ]
  test.ok approximate a, b
  do test.done

testcase["acos"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).acos()
  b = [ nan, nan, nan, 2.4980915447965, 1.9823131728624, 1.5707963267949, 1.1592794807274, 0.64350110879328, nan, nan ]
  test.ok approximate a, b
  do test.done

testcase["add"] = (test)->
  test.expect 2
  a = Array.series(10, -2, 0.4)
  b = a.add(-0.1,0.2)
  c = [ -2, -1.6, -1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2, 1.6, -0.1 ]
  test.notEqual a, b
  test.ok approximate b, c
  do test.done

testcase["addAll"] = (test)->
  test.expect 3
  a = Array.series(10, -2, 0.4)
  b = a.addAll([-0.1,0.2])
  c = [ -2, -1.6, -1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2, 1.6, -0.1, 0.2 ]
  test.notEqual a, b
  test.ok approximate b, c
  d = a.addAll(-0.1,0.2)
  e = [ -2, -1.6, -1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2, 1.6, -0.1 ]
  test.ok approximate d, e
  do test.done

testcase["addFirst"] = (test)->
  test.expect 2
  a = [1,2,3]
  test.deepEqual a.addFirst(0), [0,1,2,3]
  test.deepEqual a, [1,2,3]
  do test.done

testcase["addIfNotNil"] = (test)->
  test.expect 3
  a = [1,2,3]
  b = a.addIfNotNil(0)
  test.deepEqual b, [1,2,3,0]
  b = a.addIfNotNil(null)
  test.deepEqual b, [1,2,3]
  test.equal a, b
  do test.done

testcase["amclip"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).amclip([-0.1,0.1])        
  b = [ -0, -0.16, -0, -0.08, -0, 0, 0, 0.08, 0, 0.16 ]
  test.ok approximate a, b
  do test.done

testcase["ampdb"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).ampdb()
  b = [ nan, nan, nan, nan, nan, -inf, -7.9588001734407, -1.9382002601611, 1.5836249209525, 4.0823996531185 ]
  test.ok approximate a, b
  do test.done

testcase["any"] = (test)->
  test.expect 2
  test.equal [1,3,5,6].any("even"), true
  test.equal [1,3,5,7].any("even"), false
  do test.done

testcase["asArray"] = (test)->
  test.expect 1
  test.ok Array.isArray( 5.asArray() )
  do test.done

testcase["asBoolean"] = (test)->
  test.expect 3
  test.equal (+1).asBoolean(), true
  test.equal ( 0).asBoolean(), false
  test.equal (-1).asBoolean(), true
  do test.done

testcase["asFloat"] = (test)->
  test.expect 0
  do test.done

testcase["asFloat32Array"] = (test)->
  test.expect 1
  test.ok [1,2,3].asFloat32Array() instanceof Float32Array
  do test.done

testcase["asFloat64Array"] = (test)->
  test.expect 1
  test.ok [1,2,3].asFloat64Array() instanceof Float64Array
  do test.done

testcase["asFunction"] = (test)->
  test.expect 2
  test.equal typeof (5).asFunction(), "function"
  test.equal (5).asFunction()(), 5
  do test.done

testcase["asin"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).asin()
  b = [ nan, nan, nan, -0.92729521800161, -0.41151684606749, 0, 0.41151684606749, 0.92729521800161, nan, nan ]
  test.ok approximate a, b
  do test.done

testcase["asInt16Array"] = (test)->
  test.expect 1
  test.ok [1,2,3].asInt16Array() instanceof Int16Array
  do test.done

testcase["asInt32Array"] = (test)->
  test.expect 1
  test.ok [1,2,3].asInt32Array() instanceof Int32Array
  do test.done

testcase["asInt8Array"] = (test)->
  test.expect 1
  test.ok [1,2,3].asInt8Array() instanceof Int8Array
  do test.done

testcase["asInteger"] = (test)->
  test.expect 2
  test.equal (5.0).asInteger(), 5
  test.equal (5.8).asInteger(), 5
  do test.done

testcase["asNumber"] = (test)->
  test.expect 2
  test.equal (5.0).asNumber(), 5.0
  test.equal (5.8).asNumber(), 5.8
  do test.done

testcase["asString"] = (test)->
  test.expect 2
  test.equal (5.0).asString(), "5"
  test.equal (5.8).asString(), "5.8"
  do test.done

testcase["asUint16Array"] = (test)->
  test.expect 1
  test.ok [1,2,3].asUint16Array() instanceof Uint16Array
  do test.done

testcase["asUint32Array"] = (test)->
  test.expect 1
  test.ok [1,2,3].asUint32Array() instanceof Uint32Array
  do test.done

testcase["asUint8Array"] = (test)->
  test.expect 1
  test.ok [1,2,3].asUint8Array() instanceof Uint8Array
  do test.done

testcase["at"] = (test)->
  test.expect 2
  test.equal     [3, 4, 5].at( 1   ), 4;
  test.deepEqual [3, 4, 5].at([1,0]), [4, 3];
  do test.done

testcase["atan"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).atan()
  b = [ -1.1071487177941, -1.0121970114513, -0.87605805059819, -0.67474094222355, -0.38050637711236, 0, 0.38050637711237, 0.67474094222355, 0.87605805059819, 1.0121970114513 ]
  test.ok approximate a, b
  do test.done

testcase["atan2"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).atan2([-0.1,0.2])
  b = [ -1.6207547225168, -1.4464413322481, -1.6539375586833, -1.325817663668, -1.8157749899218, 0, 1.8157749899218, 1.325817663668, 1.6539375586833, 1.4464413322481 ]
  test.ok approximate a, b
  do test.done

testcase["atDec"] = (test)->
  test.expect 1
  test.deepEqual [1, 2, 3, 4].atDec(1), [1, 1, 3, 4]
  do test.done

testcase["atInc"] = (test)->
  test.expect 1
  test.deepEqual [1, 2, 3, 4].atInc(1), [1, 3, 3, 4]
  do test.done

testcase["atModify"] = (test)->
  test.expect 1
  test.deepEqual [1, 2, 3, 4].atModify(1, (a, b)->a*100+b), [1, 201, 3, 4]
  do test.done

testcase["biexp"] = (test)->
  test.expect 0
  do test.done

testcase["bilin"] = (test)->
  test.expect 0
  do test.done

testcase["bilinrand"] = (test)->
  test.expect 0
  do test.done

testcase["binaryValue"] = (test)->
  test.expect 3
  test.equal (+1).binaryValue(), 1
  test.equal ( 0).binaryValue(), 0
  test.equal (-1).binaryValue(), 0
  do test.done

testcase["bitAnd"] = (test)->
  test.expect 2
  test.equal (0xa5f0).bitAnd(0xf731), 0xa5f0 & 0xf731
  test.deepEqual (0xa5f0).bitAnd([0xf731]), [0xa5f0 & 0xf731]
  do test.done

testcase["bitNot"] = (test)->
  test.expect 1
  test.equal 0x123456789.bitNot(), ~0x123456789
  do test.done

testcase["bitOr"] = (test)->
  test.expect 2
  test.equal (0xa5f0).bitOr(0xf731), 0xa5f0 | 0xf731
  test.deepEqual (0xa5f0).bitOr([0xf731]), [0xa5f0 | 0xf731]
  do test.done

testcase["bitTest"] = (test)->
  test.expect 3
  test.equal (7).bitTest(0), true
  test.equal (7).bitTest(3), false
  test.deepEqual (7).bitTest([0,3]), [true,false]
  do test.done

testcase["bitXor"] = (test)->
  test.expect 2
  test.equal (0xa5f0).bitXor(0xf731), 0xa5f0 ^ 0xf731
  test.deepEqual (0xa5f0).bitXor([0xf731]), [0xa5f0 ^ 0xf731]
  do test.done

testcase["blendAt"] = (test)->
  test.expect 3
  test.deepEqual [2, 3, 5, 6].blendAt([-1.5,2.2,5.8]), [ 2, 5.2, 6 ]
  test.deepEqual [2, 3, 5, 6].blendAt([-1.5,2.2,5.8], "wrapAt"), [ 5.5, 5.2, 4.6 ]
  test.deepEqual [2, 3, 5, 6].blendAt([-1.5,2.2,5.8], "foldAt"), [ 4, 5.2, 2.2 ]
  do test.done

testcase["bubble"] = (test)->
  test.expect 2
  a = 10.bubble(1, 3)
  b = [ [ [ 10 ] ] ]
  test.deepEqual a, b
  a = [1,2,[3],4].bubble(1, 3)
  b = [ [ [ [ 1 ] ] ], [ [ [ 2 ] ] ], [ [ [ [ 3 ] ] ] ], [ [ [ 4 ] ] ] ]
  test.deepEqual a, b
  do test.done

testcase["ceil"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).ceil()
  b = [ -2, -1, -1, -0, -0, 0, 1, 1, 2, 2 ]
  test.deepEqual a, b
  do test.done

testcase["choose"] = (test)->
  test.expect 1
  a = [1,2,3]
  test.ok [0...10000].every -> a.indexOf(a.choose()) != -1
  do test.done

testcase["clip"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).clip(-0.5, 1)
  b = [ -0.5, -0.5, -0.5, -0.5, -0.4, 0, 0.4, 0.8, 1, 1 ]
  test.ok approximate a, b
  do test.done

testcase["clip2"] = (test)->
  test.expect 2
  a = Array.series(10, -2, 0.4).clip2(1)
  b = [ -1, -1, -1, -0.8, -0.4, 0, 0.4, 0.8, 1, 1 ]
  test.ok approximate a, b
  a = Array.series(10, -2, 0.4).clip2(-1)
  b = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]
  test.ok approximate a, b
  do test.done

testcase["clipAt"] = (test)->
  test.expect 3
  test.equal [3, 4, 5].clipAt(6), 5
  test.equal [3, 4, 5].clipAt(-1), 3
  test.deepEqual [3, 4, 5].clipAt([6,8]), [5, 5];
  do test.done

testcase["clipExtend"] = (test)->
  test.expect 1
  test.deepEqual [-2,-1,0,1,2].clipExtend(10), [ -2, -1, 0, 1, 2, 2, 2, 2, 2, 2 ]
  do test.done

testcase["clipPut"] = (test)->
  test.expect 1
  test.deepEqual [1,2,3,4].clipPut(5, 10), [ 1, 2, 3, 10 ]
  do test.done

testcase["clipSwap"] = (test)->
  test.expect 1
  test.deepEqual [1,2,3,4].clipSwap(0, 10), [ 4, 2, 3, 1 ]
  do test.done

testcase["clump"] = (test)->
  test.expect 1
  test.deepEqual [1, 2, 3, 4, 5, 6, 7, 8].clump(3), [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8 ] ]
  do test.done

testcase["clumps"] = (test)->
  test.expect 1
  test.deepEqual [1, 2, 3, 4, 5, 6, 7, 8].clumps([1, 2]), [ [ 1 ], [ 2, 3 ], [ 4 ], [ 5, 6 ], [ 7 ], [ 8 ] ]
  do test.done

testcase["coin"] = (test)->
  test.expect 1
  a = [0.1, 0.2, 0.3].coin()
  test.ok a.every (x)-> typeof x is 'boolean'
  do test.done

testcase["collect"] = (test)->
  test.expect 5
  a = [1,2,3,4].collect (x, i)->
    test.equal x, i + 1
    x * 10 + i
  test.deepEqual a, [10,21,32,43]
  do test.done

testcase["concat"] = (test)->
  test.expect 0
  do test.done

testcase["copy"] = (test)->
  test.expect 2
  a = [1,2,3,4,5]
  b = a.copy()
  test.deepEqual a, b
  test.notEqual  a, b
  do test.done

testcase["copyFromStart"] = (test)->
  test.expect 2
  test.deepEqual [1, 2, 3, 4, 5].copyFromStart(1), [1, 2]
  test.deepEqual [1, 2, 3, 4, 5].copyFromStart([1, 2]), [[1, 2], [1, 2, 3]]
  do test.done

testcase["copyRange"] = (test)->
  test.expect 2
  test.deepEqual [1, 2, 3, 4, 5].copyRange(1, 3), [2, 3, 4]
  test.deepEqual [1, 2, 3, 4, 5].copyRange([1, 2], 3), [[2, 3, 4], [3, 4]]
  do test.done

testcase["copyToEnd"] = (test)->
  test.expect 2
  test.deepEqual [1, 2, 3, 4, 5].copyToEnd(1), [2, 3, 4, 5]
  test.deepEqual [1, 2, 3, 4, 5].copyToEnd([1, 2]), [[2, 3, 4, 5], [3, 4, 5]]
  do test.done

testcase["cos"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).cos()
  b = [ -0.41614683654714, -0.029199522301289, 0.36235775447667, 0.69670670934717, 0.92106099400289, 1, 0.92106099400288, 0.69670670934717, 0.36235775447667, -0.029199522301289 ]
  test.ok approximate a, b
  do test.done

testcase["cosh"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).cosh()
  b = [ 3.7621956910836, 2.5774644711949, 1.8106555673244, 1.3374349463048, 1.0810723718385, 1, 1.0810723718385, 1.3374349463048, 1.8106555673244, 2.5774644711949 ]
  test.ok approximate a, b
  do test.done

testcase["count"] = (test)->
  test.expect 1
  test.equal [1, 2, 3, 4].count("even"), 2
  do test.done

testcase["cpsmidi"] = (test)->
  test.expect 1
  a = Array.series(10, 220, 110).cpsmidi()
  b = [57, 64.019550008654, 69, 72.863137138648, 76.019550008654, 78.688259064691, 81, 83.039100017308, 84.863137138648, 86.513179423648 ]
  test.ok approximate a, b
  do test.done

testcase["cpsoct"] = (test)->
  test.expect 1
  a = Array.series(10, 220, 110).cpsoct()
  b = [ 3.7499999999827, 4.3349625007038, 4.7499999999827, 5.0719280948701, 5.3349625007038, 5.5573549220403, 5.7499999999827, 5.919925001425, 6.0719280948701, 6.20943161862 ]
  test.ok approximate a, b
  do test.done

testcase["cubed"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1).cubed()
  b = [ -64, -27, -8, -1, 0, 1, 8, 27, 64, 125 ]
  test.deepEqual a, b
  do test.done

testcase["curdle"] = (test)->
  test.expect 0
  do test.done

testcase["curvelin"] = (test)->
  test.expect 1
  a = [1..10].collect (num)-> num.curvelin(0, 10, -4.3, 100, -3)
  b = [ 0.013637084416479, 0.013953595612625, 0.014270407632449, 0.01458752104832, 0.014904936434246, 0.015222654365874, 0.015540675420501, 0.015859000177075, 0.016177629216206, 100 ]
  test.ok approximate a, b
  do test.done

testcase["dbamp"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).dbamp()
  b = [ 0.79432823472428, 0.83176377110267, 0.87096358995608, 0.91201083935591, 0.95499258602144, 1, 1.0471285480509, 1.0964781961432, 1.1481536214969, 1.2022644346174 ]
  test.ok approximate a, b
  do test.done

testcase["degrad"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).degrad()
  b = [ -0.034906585039887, -0.027925268031909, -0.020943951023932, -0.013962634015955, -0.0069813170079773, 0, 0.0069813170079773, 0.013962634015955, 0.020943951023932, 0.027925268031909 ]
  test.ok approximate a, b
  do test.done

testcase["degreeToKey"] = (test)->
  test.expect 0
  do test.done

testcase["delimit"] = (test)->
  test.expect 0
  do test.done

testcase["detect"] = (test)->
  test.expect 2
  test.equal [1, 2, 3, 4].detect("even"), 2
  test.equal [1, 2, 3, 4].detect((x)-> x is 5), null
  do test.done

testcase["detectIndex"] = (test)->
  test.expect 2
  test.equal [1, 2, 3, 4].detectIndex("even"), 1
  test.equal [1, 2, 3, 4].detectIndex((x)-> x is 5), -1
  do test.done

testcase["difference"] = (test)->
  test.expect 1
  test.deepEqual [1, 2, 3].difference([2, 3, 4, 5]), [1]
  do test.done

testcase["differentiate"] = (test)->
  test.expect 1
  a = [3, 4, 1, 1].differentiate()
  b = [ 3, 1, -3, 0 ]
  test.deepEqual a, b
  do test.done
  
testcase["difsqr"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).difsqr(4)
  b = [ -12, -13.44, -14.56, -15.36, -15.84, -16, -15.84, -15.36, -14.56, -13.44 ]
  test.ok approximate a, b
  do test.done

testcase["distort"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).distort()
  b = [ -0.66666666666667, -0.61538461538462, -0.54545454545455, -0.44444444444444, -0.28571428571429, 0, 0.28571428571429, 0.44444444444444, 0.54545454545455, 0.61538461538462 ]
  test.ok approximate a, b
  do test.done

testcase["div"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 2.5).div(2)
  b = [ -2, -1, 0, 1, 3, 4, 5, 6, 8, 9 ]
  test.deepEqual a, b
  do test.done

testcase["do"] = (test)->
  test.expect 5
  a = [1,2,3,4].do (x, i)->
     test.equal x, i + 1
  test.deepEqual a, [1,2,3,4]
  do test.done

testcase["doAdjacentPairs"] = (test)->
  test.expect 1
  a = []
  [1,2,3,4].doAdjacentPairs (i, j)-> a.push i * 10 + j
  test.deepEqual a, [12, 23, 34]
  do test.done

testcase["drop"] = (test)->
  test.expect 2
  test.deepEqual [1, 2, 3, 4, 5].drop(+3), [4, 5]
  test.deepEqual [1, 2, 3, 4, 5].drop(-3), [1, 2]
  do test.done

testcase["dup"] = (test)->
  test.expect 2
  a = (10).dup()
  b = [ 10, 10 ]
  test.deepEqual a, b
  a = Array.series(10, -4, 2.5).dup()
  b = [ [ -4, -1.5, 1, 3.5, 6, 8.5, 11, 13.5, 16, 18.5 ], [ -4, -1.5, 1, 3.5, 6, 8.5, 11, 13.5, 16, 18.5 ] ]
  test.ok approximate a, b
  do test.done

testcase["equals"] = (test)->
  test.expect 1
  test.equal [1,2,[3,[4]]].equals([1,2,[3,[4]]]), true
  do test.done

testcase["equalWithPrecision"] = (test)->
  test.expect 0
  do test.done

testcase["even"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 3).even()
  b = [ true, false, true, false, true, false, true, false, true, false ]
  test.deepEqual a, b
  do test.done

testcase["every"] = (test)->
  test.expect 2
  test.equal [1,3,5,6].sc_every("even"), false
  test.equal [2,4,6,8].sc_every("even"), true
  do test.done

testcase["excess"] = (test)->
  test.expect 1
  a = Array.series(10,-4,1.5).excess(2)
  b = [ -2, -0.5, 0, 0, 0, 1.5, 3, 4.5, 6, 7.5 ]
  test.ok approximate a, b
  do test.done

testcase["exclusivelyBetween"] = (test)->
  test.expect 1
  a = Array.series(10,-4,1.5).exclusivelyBetween(0, 5)
  b = [ false, false, false, true, true, true, false, false, false, false ]
  test.deepEqual a, b
  do test.done

testcase["exp"] = (test)->
  test.expect 1
  a = Array.series(10,-4,1.5).exp()
  b = [ 0.018315638888734, 0.082084998623899, 0.36787944117144, 1.6487212707001, 7.3890560989307, 33.115451958692, 148.41315910258, 665.14163304436, 2980.9579870417, 13359.726829662 ]
  test.ok approximate a, b
  do test.done

testcase["expexp"] = (test)->
  test.expect 1
  a = [1..10].expexp(0.1, 10, 4.3, 100)
  b = [ 20.736441353328, 33.297967128289, 43.927334414298, 53.468895457258, 62.275397394186, 70.537220559589, 78.371975256493, 85.858778417445, 93.05409138757, 100 ]
  test.ok approximate a, b
  do test.done

testcase["explin"] = (test)->
  test.expect 1
  a = [1..10].collect (num)-> num.explin(0.1, 10, -4.3, 100)
  b = [ 47.85, 63.548714273877, 72.73187343363, 79.247428547753, 84.301285726123, 88.430587707507, 91.921862786744, 94.94614282163, 97.613746867261, 100 ]
  test.ok approximate a, b
  do test.done

testcase["exprand"] = (test)->
  test.expect 0
  do test.done

testcase["extend"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1.5).extend(20, 5)
  b = [ -4, -2.5, -1, 0.5, 2, 3.5, 5, 6.5, 8, 9.5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ]
  test.deepEqual a, b
  do test.done

testcase["factors"] = (test)->
  test.expect 1
  a = Array.series(10, 1, 11).factors()
  b = [ [  ], [ 2, 2, 3 ], [ 23 ], [ 2, 17 ], [ 3, 3, 5 ], [ 2, 2, 2, 7 ], [ 67 ], [ 2, 3, 13 ], [ 89 ], [ 2, 2, 5, 5 ] ]
  test.deepEqual a, b
  do test.done

testcase["factorial"] = (test)->
  test.expect 1
  a = Array.series(15, -2, 1).factorial()
  b = [ 1, 1, 1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600 ]
  test.deepEqual a, b
  do test.done

testcase["*fib"] = (test)->
  test.expect 2
  test.deepEqual Array.fib(10), [ 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 ]
  test.deepEqual Array.fib(10, 2, 5), [ 5, 7, 12, 19, 31, 50, 81, 131, 212, 343 ]
  do test.done

testcase["fib"] = (test)->
  test.expect 1
  a = 10.fib()
  b = [ 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 ]
  test.deepEqual a, b
  do test.done

testcase["*fill"] = (test)->
  test.expect 2
  a = Array.fill(5, 1)
  b = [ 1, 1, 1, 1, 1 ]
  test.deepEqual a, b
  a = Array.fill(5, (i)->i*2)
  b = [ 0, 2, 4, 6, 8 ]
  test.deepEqual a, b
  do test.done

testcase["*fill2D"] = (test)->
  test.expect 2
  a = Array.fill2D(3, 2, 1)
  b = [ [ 1, 1 ], [ 1, 1 ], [ 1, 1 ] ]
  test.deepEqual a, b
  a = Array.fill2D(3, 2, (y, x)->y*10+x)
  b = [ [ 0, 1 ], [ 10, 11 ], [ 20, 21 ] ]
  test.deepEqual a, b
  do test.done
  
testcase["*fill3D"] = (test)->
  test.expect 2
  a = Array.fill3D(4, 3, 2, 1)
  b = [ [ [ 1, 1 ], [ 1, 1 ], [ 1, 1 ] ], [ [ 1, 1 ], [ 1, 1 ], [ 1, 1 ] ], [ [ 1, 1 ], [ 1, 1 ], [ 1, 1 ] ], [ [ 1, 1 ], [ 1, 1 ], [ 1, 1 ] ] ]
  test.deepEqual a, b
  a = Array.fill3D(4, 3, 2, (z, y, x)->z*100+y*10+x)
  b = [ [ [ 0, 1 ], [ 10, 11 ], [ 20, 21 ] ], [ [ 100, 101 ], [ 110, 111 ], [ 120, 121 ] ], [ [ 200, 201 ], [ 210, 211 ], [ 220, 221 ] ], [ [ 300, 301 ], [ 310, 311 ], [ 320, 321 ] ] ]
  test.deepEqual a, b
  do test.done

testcase["*fillND"] = (test)->
  test.expect 2
  a = Array.fillND([1,2,3,4], 1)
  b = [ [ [ [ 1, 1, 1, 1 ], [ 1, 1, 1, 1 ], [ 1, 1, 1, 1 ] ], [ [ 1, 1, 1, 1 ], [ 1, 1, 1, 1 ], [ 1, 1, 1, 1 ] ] ] ]
  test.deepEqual a, b
  a = Array.fillND([5,4,3,2], (a,b,c,d)->a*1000+b*100+c*10+d)
  b = [ [ [ [ 0, 1 ], [ 10, 11 ], [ 20, 21 ] ], [ [ 100, 101 ], [ 110, 111 ], [ 120, 121 ] ], [ [ 200, 201 ], [ 210, 211 ], [ 220, 221 ] ], [ [ 300, 301 ], [ 310, 311 ], [ 320, 321 ] ] ], [ [ [ 1000, 1001 ], [ 1010, 1011 ], [ 1020, 1021 ] ], [ [ 1100, 1101 ], [ 1110, 1111 ], [ 1120, 1121 ] ], [ [ 1200, 1201 ], [ 1210, 1211 ], [ 1220, 1221 ] ], [ [ 1300, 1301 ], [ 1310, 1311 ], [ 1320, 1321 ] ] ], [ [ [ 2000, 2001 ], [ 2010, 2011 ], [ 2020, 2021 ] ], [ [ 2100, 2101 ], [ 2110, 2111 ], [ 2120, 2121 ] ], [ [ 2200, 2201 ], [ 2210, 2211 ], [ 2220, 2221 ] ], [ [ 2300, 2301 ], [ 2310, 2311 ], [ 2320, 2321 ] ] ], [ [ [ 3000, 3001 ], [ 3010, 3011 ], [ 3020, 3021 ] ], [ [ 3100, 3101 ], [ 3110, 3111 ], [ 3120, 3121 ] ], [ [ 3200, 3201 ], [ 3210, 3211 ], [ 3220, 3221 ] ], [ [ 3300, 3301 ], [ 3310, 3311 ], [ 3320, 3321 ] ] ], [ [ [ 4000, 4001 ], [ 4010, 4011 ], [ 4020, 4021 ] ], [ [ 4100, 4101 ], [ 4110, 4111 ], [ 4120, 4121 ] ], [ [ 4200, 4201 ], [ 4210, 4211 ], [ 4220, 4221 ] ], [ [ 4300, 4301 ], [ 4310, 4311 ], [ 4320, 4321 ] ] ] ]
  test.deepEqual a, b
  do test.done

testcase["find"] = (test)->
  test.expect 2
  test.equal [7, 8, 7, 6, 5, 6, 7, 6, 7, 8, 9].find([7, 6, 5]), 2
  test.equal [7, 8, 7, 6, 5, 6, 7, 6, 7, 8, 9].find([7, 6, 4]), -1
  do test.done

testcase["findAll"] = (test)->
  test.expect 1
  test.deepEqual [7, 8, 7, 6, 5, 6, 7, 6, 7, 8, 9].findAll([7, 6]), [2, 6]
  do test.done

testcase["first"] = (test)->
  test.expect 1
  test.equal [1,2,3,4,5].first(), 1
  do test.done

testcase["flat"] = (test)->
  test.expect 1
  test.deepEqual [[1, 2, 3], [[4, 5], [[6]]]].flat(), [1, 2, 3, 4, 5, 6]
  do test.done

testcase["flatIf"] = (test)->
  test.expect 0
  do test.done

testcase["flatSize"] = (test)->
  test.expect 1
  test.equal [1,2,[3,4,[5,6]]].flatSize(), 6
  do test.done

testcase["flatten"] = (test)->
  test.expect 2
  a = [[1, 2, 3], [[4, 5], [[6]]]].flatten()
  b = [ 1, 2, 3, [ 4, 5 ], [ [ 6 ] ] ]
  test.deepEqual a, b
  a = [[1, 2, 3], [[4, 5], [[6]]]].flatten(2)
  b = [ 1, 2, 3, 4, 5, [ 6 ] ]
  test.deepEqual a, b
  do test.done

testcase["floor"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1.5).floor()
  b = [ -4, -3, -1, 0, 2, 3, 5, 6, 8, 9 ]
  test.deepEqual a, b
  do test.done

testcase["flop"] = (test)->
  test.expect 3
  a = [[1, 2, 3], [4, 5, 6]].flop();
  b = [ [ 1, 4 ], [ 2, 5 ], [ 3, 6 ] ]
  test.deepEqual a, b
  a = [[1, 2, 3], [4, 5, 6], [7, 8]].flop()
  b = [ [ 1, 4, 7 ], [ 2, 5, 8 ], [ 3, 6, 7 ] ]
  test.deepEqual a, b
  a = [].flop()
  b = [ [  ] ]
  test.deepEqual a, b
  do test.done

testcase["fold"] = (test)->
  test.expect 3
  a = Array.series(20, -10, 1).fold(-1, 2)
  b = [ 2, 1, 0, -1, 0, 1, 2, 1, 0, -1, 0, 1, 2, 1, 0, -1, 0, 1, 2, 1 ]
  test.deepEqual a, b
  a = [-2,-1,0,1,2].fold(-0.1, 0.2)
  b = [ -3.6082248300318e-16, 0.2, 0, 8.3266726846887e-17, 0.2 ]
  test.ok approximate a, b
  a = [-2,-1,0,1,2].fold(0.2, -0.1)
  b = [ -0.2, -0.4, -0.2, -0.2, -0.4 ]
  test.ok approximate a, b
  do test.done

testcase["fold2"] = (test)->
  test.expect 2
  a = Array.series(20, -10, 1).fold2(2)
  b = [ -2, -1, 0, 1, 2, 1, 0, -1, -2, -1, 0, 1, 2, 1, 0, -1, -2, -1, 0, 1 ]
  test.deepEqual a, b
  a = Array.series(20, -10, 1).fold2(-2)
  b = [ -2, -3, -4, -5, -6, -5, -4, -3, -2, -3, -4, -5, -6, -5, -4, -3, -2, -3, -4, -5 ]
  test.deepEqual a, b
  do test.done

testcase["foldAt"] = (test)->
  test.expect 3
  test.equal [3, 4, 5].foldAt(6), 5
  test.equal [3, 4, 5].foldAt(-1), 4
  test.deepEqual [3, 4, 5].foldAt([6, 8]), [5, 3]
  do test.done

testcase["foldExtend"] = (test)->
  test.expect 1
  a = [-2,-1,0,1,2].foldExtend(10)
  b = [ -2, -1, 0, 1, 2, 1, 0, -1, -2, -1 ]
  test.deepEqual a, b
  do test.done

testcase["foldPut"] = (test)->
  test.expect 1
  test.deepEqual [1,2,3,4].foldPut(5, 10), [ 1, 10, 3, 4 ]
  do test.done

testcase["foldSwap"] = (test)->
  test.expect 0
  do test.done

testcase["for"] = (test)->
  test.expect 3
  i = j = 0
  a = 10.for 15, (_i, _j)->
    i += _i
    j += _j
  test.equal a, 10
  test.equal i, 75
  test.equal j, 15
  do test.done

testcase["forBy"] = (test)->
  test.expect 3
  i = j = 0
  a = 10.forBy 15, 2, (_i, _j)->
    i += _i
    j += _j
  test.equal a, 10
  test.equal i, 36
  test.equal j,  3
  do test.done

testcase["forSeries"] = (test)->
  test.expect 3
  i = j = 0
  a = 10.forSeries 12, 15, (_i, _j)->
    i += _i
    j += _j
  test.equal a, 10
  test.equal i, 36
  test.equal j,  3
  do test.done

testcase["frac"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1.15).frac()
  b = [ 0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 0.049999999999999, 0.2, 0.35 ]
  test.ok approximate a, b
  do test.done

testcase["gauss"] = (test)->
  test.expect 0
  do test.done

testcase["gaussCurve"] = (test)->
  test.expect 0
  do test.done

testcase["gcd"] = (test)->
  test.expect 1
  a = Array.series(10, 2, 11).gcd([24, 31])
  b = [ 2, 1, 24, 1, 2, 1, 4, 1, 6, 1 ]
  test.deepEqual a, b
  do test.done

testcase["*geom"] = (test)->
  test.expect 1
  a = Array.geom(10, 1, 2)
  b = [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512 ]
  test.deepEqual a, b
  do test.done

testcase["geom"] = (test)->
  test.expect 1
  a = 10.geom(1, 2)
  b = [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512 ]
  test.deepEqual a, b
  do test.done

testcase["greater"] = (test)->
  test.expect 4
  test.equal 10.sc(">")( 9), true
  test.equal 10.sc(">")(10), false
  test.equal 10.sc(">")(11), false
  test.deepEqual 10.greater([9,10,11]), [true,false,false]
  do test.done

testcase["greaterThan"] = (test)->
  test.expect 4
  test.equal 10.sc(">=")( 9), true
  test.equal 10.sc(">=")(10), true
  test.equal 10.sc(">=")(11), false
  test.deepEqual 10.greaterThan([9,10,11]), [true,true,false]
  do test.done

testcase["half"] = (test)->
  test.expect 1
  test.equal 3.half(), 1.5
  do test.done

testcase["hanWindow"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).hanWindow()
  b = [ 0, 0, 0.095491502812526, 0.5, 0.90450849718747, 0.97552825814758, 0.65450849718747, 0.20610737385376, 0, 0 ]
  test.ok approximate a, b
  do test.done

testcase["histo"] = (test)->
  test.expect 0
  do test.done

testcase["hypot"] = (test)->
  test.expect 1
  a = Array.series(10, -0.5, 0.21).hypot(0.2)
  b = [ 0.53851648071345, 0.35227829907617, 0.21540659228538, 0.23853720883753, 0.39446165846632, 0.58523499553598, 0.78587530817554, 0.99040395798886, 1.1968291440302, 1.4043147795277 ]
  test.ok approximate a, b
  do test.done

testcase["hypotApx"] = (test)->
  test.expect 1
  a = Array.series(10, -0.5, 0.21).hypotApx(0.2)
  b = [ 0.61715728640556, 0.40715728640556, 0.24686291456223, 0.27615223616362, 0.45715728640556, 0.66715728640556, 0.87715728640556, 1.0871572864056, 1.2971572864056, 1.5071572864056 ]
  test.ok approximate a, b
  do test.done

testcase["includes"] = (test)->
  test.expect 2
  test.equal [1, 2, 3, 4].includes(4), true
  test.equal [1, 2, 3, 4].includes(5), false
  do test.done

testcase["includesAll"] = (test)->
  test.expect 3
  test.equal [1, 2, 3, 4].includesAll([3, 4]), true
  test.equal [1, 2, 3, 4].includesAll([4, 5]), false
  test.equal [1, 2, 3, 4].includesAll([5, 6]), false
  do test.done

testcase["includesAny"] = (test)->
  test.expect 3
  test.equal [1, 2, 3, 4].includesAny([3, 4]), true
  test.equal [1, 2, 3, 4].includesAny([4, 5]), true
  test.equal [1, 2, 3, 4].includesAny([5, 6]), false
  do test.done

testcase["inclusivelyBetween"] = (test)->
  test.expect 0
  do test.done

testcase["indexIn"] = (test)->
  # collection must be sorted
  test.expect 1
  test.equal [2, 3, 5, 6].indexIn(5.2), 2
  do test.done

testcase["indexInBetween"] = (test)->
  # collection must be sorted
  test.expect 1
  test.equal [2, 3, 5, 6].indexInBetween(5.2), 2.2
  do test.done

testcase["indexOf"] = (test)->
  test.expect 2
  test.equal [3, 4, 100, 5].sc_indexOf(100), 2
  test.equal [3, 4, 100, 5].sc_indexOf(101), -1
  do test.done

testcase["indexOfEqual"] = (test)->
  test.expect 2
  test.equal [3, 4, [100], 5].indexOfEqual([100]), 2
  test.equal [3, 4, [100], 5].indexOfEqual(100), -1
  do test.done

testcase["indexOfGreaterThan"] = (test)->
  test.expect 1
  test.equal [ 10, 5, 77, 55, 12, 123].indexOfGreaterThan(70), 2
  do test.done

testcase["indicesOf"] = (test)->
  test.expect 1
  test.deepEqual [3, 4, 100, 5, 100].indicesOf(100), [2, 4]
  do test.done

testcase["indicesOfEqual"] = (test)->
  test.expect 1
  test.deepEqual [3, 4, [100], 5, [100]].indicesOfEqual([100]), [2, 4]
  do test.done

testcase["inject"] = (test)->
  test.expect 1
  test.equal [1,2,3,4,5].inject(0, "+"), 15
  do test.done

testcase["injectr"] = (test)->
  test.expect 1
  test.deepEqual [1,2,3,4,5].injectr([], "++"), [ 5, 4, 3, 2, 1 ]
  do test.done

testcase["insert"] = (test)->
  test.expect 0
  do test.done

testcase["instill"] = (test)->
  test.expect 0
  do test.done

testcase["*interpolation"] = (test)->
  test.expect 1
  test.ok approximate Array.interpolation(5, 3.2, 20.5), [ 3.2, 7.525, 11.85, 16.175, 20.5 ]
  do test.done

testcase["invert"] = (test)->
  test.expect 2
  test.deepEqual [1,2,3,4].invert(), [ 4, 3, 2, 1 ]
  test.deepEqual [1,2,3,4].invert(1), [ 1, 0, -1, -2 ]
  do test.done

testcase["isArray"] = (test)->
  test.expect 4
  test.equal [  ].isArray(), true
  test.equal (10).isArray(), false
  test.equal "  ".isArray(), false
  test.equal (->).isArray(), false
  do test.done

testcase["isBoolean"] = (test)->
  test.expect 0
  do test.done

testcase["isEmpty"] = (test)->
  test.expect 2
  test.equal [ ].isEmpty(), true
  test.equal [1].isEmpty(), false
  do test.done

testcase["isFunction"] = (test)->
  test.expect 0
  do test.done

testcase["isNaN"] = (test)->
  test.expect 0
  do test.done

testcase["isNegative"] = (test)->
  test.expect 3
  test.equal (+2).isNegative(), false
  test.equal ( 0).isNegative(), false
  test.equal (-2).isNegative(), true
  do test.done

testcase["isNumber"] = (test)->
  test.expect 0
  do test.done

testcase["isPositive"] = (test)->
  test.expect 3
  test.equal (+2).isPositive(), true
  test.equal ( 0).isPositive(), true
  test.equal (-2).isPositive(), false
  do test.done

testcase["isPowerOfTwo"] = (test)->
  test.expect 0
  do test.done

testcase["isStrictlyPositive"] = (test)->
  test.expect 3
  test.equal (+2).isStrictlyPositive(), true
  test.equal ( 0).isStrictlyPositive(), false
  test.equal (-2).isStrictlyPositive(), false
  do test.done

testcase["isString"] = (test)->
  test.expect 0
  do test.done

testcase["isSubsetOf"] = (test)->
  test.expect 2
  test.equal [1, 2].isSubsetOf([1,2,3,4]), true
  test.equal [1, 5].isSubsetOf([1,2,3,4]), false  
  do test.done

testcase["iwrap"] = (test)->
  test.expect 1
  a = Array.series(10, -17, 11).iwrap(-1, 2)
  b = [ -1, 2, 1, 0, -1, 2, 1, 0, -1, 2 ]
  test.deepEqual a, b
  do test.done

testcase["keep"] = (test)->
  test.expect 2
  test.deepEqual [1, 2, 3, 4, 5].keep(+3), [1, 2, 3]
  test.deepEqual [1, 2, 3, 4, 5].keep(-3), [3, 4, 5]
  do test.done

testcase["keyToDegree"] = (test)->
  test.expect 0
  do test.done

testcase["lace"] = (test)->
  test.expect 1
  a = [ [1, 2, 3], 6, [-1, -2] ].lace(12)
  b = [ 1, 6, -1, 2, 6, -2, 3, 6, -1, 1, 6, -2 ]
  test.deepEqual a, b
  do test.done

testcase["last"] = (test)->
  test.expect 1
  test.equal [1,2,3,4,5].last(), 5
  do test.done

testcase["lastForWhich"] = (test)->
  test.expect 2
  test.equal [1,2,3,4,5].lastForWhich("odd"), 1
  test.equal [1,2,3,4,5].lastForWhich("even"), null
  do test.done

testcase["lastIndex"] = (test)->
  test.expect 1
  a = Array.series(10, -17, 11).lastIndex()
  b = 9
  test.equal a, b
  do test.done

testcase["lastIndexForWhich"] = (test)->
  test.expect 2
  test.equal [1,2,3,4,5].lastIndexForWhich("odd"), 0
  test.equal [1,2,3,4,5].lastIndexForWhich("even"), -1
  do test.done

testcase["lcm"] = (test)->
  test.expect 1
  a = Array.series(10, -17, 11).lcm([24, 31])
  b = [ 408, 186, 120, 496, 216, 1178, 1176, 1860, 1704, 2542 ]
  test.deepEqual a, b
  do test.done

testcase["lcurve"] = (test)->
  test.expect 0
  do test.done

testcase["leftShift"] = (test)->
  test.expect 2
  test.equal 12.leftShift(2), 48
  test.deepEqual 12.leftShift([2]), [48]
  do test.done

testcase["less"] = (test)->
  test.expect 4
  test.equal 10.sc("<")( 9), false
  test.equal 10.sc("<")(10), false
  test.equal 10.sc("<")(11), true
  test.deepEqual 10.less([9,10,11]), [false,false,true]
  do test.done

testcase["lessThan"] = (test)->
  test.expect 4
  test.equal 10.sc("<=")( 9), false
  test.equal 10.sc("<=")(10), true
  test.equal 10.sc("<=")(11), true
  test.deepEqual 10.lessThan([9,10,11]), [false,true,true]
  do test.done

testcase["lincurve"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1.15).lincurve(-4, 6, 100, 1000, 5)
  b = [ 100, 104.74460678057, 113.17639232851, 128.16077582216, 154.78998115571, 202.11355486142, 286.2137223365, 435.67069727505, 701.27524989858, 1000 ]
  test.ok approximate a, b
  do test.done

testcase["linexp"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1.15).linexp(-4, 6, 100, 1000)
  b = [ 100, 130.31667784523, 169.82436524617, 221.30947096056, 288.40315031266, 375.83740428844, 489.77881936845, 638.26348619055, 831.76377110267, 1000 ]
  test.ok approximate a, b
  do test.done

testcase["linlin"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1.15).linlin(-4, 6, 100, 1000)
  b = [ 100, 203.5, 307, 410.5, 514, 617.5, 721, 824.5, 928, 1000 ]
  test.ok approximate a, b
  do test.done

testcase["linrand"] = (test)->
  test.expect 0
  do test.done

testcase["log"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1.15).log()
  b = [ nan, nan, nan, nan, -0.51082562376599, 0.55961578793542, 1.0647107369924, 1.3987168811184, 1.6486586255874, 1.8484548129046 ]
  test.ok approximate a, b
  do test.done

testcase["log10"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1.15).log10()
  b = [ nan, nan, nan, nan, -0.22184874961636, 0.24303804868629, 0.46239799789896, 0.60745502321467, 0.7160033436348, 0.80277372529198 ]
  test.ok approximate a, b
  do test.done

testcase["log2"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1.15).log2()
  b = [ 2, 1.5109619192774, 0.76553474636298, -0.86249647625006, -0.73696559416621, 0.8073549220576, 1.5360529002402, 2.0179219079973, 2.3785116232537, 2.6667565918848 ]
  test.ok approximate a, b
  do test.done

testcase["log2Ceil"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1).log2Ceil()
  b = [ 32, 32, 32, 32, 32, 0, 1, 2, 2, 3 ]
  test.deepEqual a, b
  do test.done

testcase["madd"] = (test)->
  test.expect 1
  test.deepEqual 10.madd([5,4,3,2,1],[100,200]), [150,240,130,220,110]
  do test.done

testcase["max"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1).max([-1, 2])
  b = [ -1, 2, -1, 2, 0, 2, 2, 3, 4, 5 ]
  test.deepEqual a, b
  do test.done

testcase["maxDepth"] = (test)->
  test.expect 1
  test.equal [[1, 2, 3], [[41, 52], 5, 6], 1, 2, 3].maxDepth(), 3
  do test.done

testcase["maxIndex"] = (test)->
  test.expect 2
  test.equal [1, -2, 3, -4].maxIndex(), 2
  test.equal [1, -2, 3, -4].maxIndex("abs"), 3
  do test.done

testcase["maxSizeAtDepth"] = (test)->
  test.expect 6
  test.equal [[1, 2, 3], [[41, 52], 5, 6], 1, 2, 3].maxSizeAtDepth(2), 2
  test.equal [[1, 2, 3], [[41, 52], 5, 6], 1, 2, 3].maxSizeAtDepth(1), 3
  test.equal [[1, 2, 3], [[41, 52], 5, 6], 1, 2, 3].maxSizeAtDepth(0), 5
  test.equal [].maxSizeAtDepth(0), 0
  test.equal [[]].maxSizeAtDepth(0), 1
  test.equal [[]].maxSizeAtDepth(1), 0
  do test.done

testcase["maxValue"] = (test)->
  test.expect 2
  test.equal [1, -2, 3, -4].maxValue(), [1, -2, 3, -4].maxItem()
  test.equal [1, -2, 3, -4].maxValue("abs"), [1, -2, 3, -4].maxItem("abs")
  do test.done

testcase["mean"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1).mean()
  b = 0.5
  test.equal a, b
  do test.done

testcase["middle"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 2).middle()
  b = 4
  test.equal a, b
  do test.done

testcase["middleIndex"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 2).middleIndex()
  b = 4
  test.equal a, b
  do test.done

testcase["midicps"] = (test)->
  test.expect 1
  a = Array.series(10, 40, 8).midicps()
  b = [ 82.406889228217, 130.8127826503, 207.65234878997, 329.62755691287, 523.2511306012, 830.60939515989, 1318.5102276515, 2093.0045224048, 3322.4375806396, 5274.0409106059 ]
  test.ok approximate a, b
  do test.done

testcase["midiratio"] = (test)->
  test.expect 1
  a = Array.series(10, -19, 8).midiratio()
  b = [ 0.33370996354397, 0.52973154718099, 0.8408964152543, 1.3348398541685, 2.1189261887122, 3.3635856609985, 5.3393594166444, 8.4757047548019, 13.45434264392, 21.357437666459 ]
  test.ok approximate a, b
  do test.done

testcase["min"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1).min([-1, 2])
  b = [ -4, -3, -2, -1, -1, 1, -1, 2, -1, 2 ]
  test.deepEqual a, b
  do test.done

testcase["minIndex"] = (test)->
  test.expect 2
  test.equal [1, -2, 3, -4].minIndex(), 3
  test.equal [1, -2, 3, -4].minIndex("abs"), 0
  do test.done

testcase["minValue"] = (test)->
  test.expect 2
  test.equal [1, -2, 3, -4].minValue(), [1, -2, 3, -4].minItem()
  test.equal [1, -2, 3, -4].minValue("abs"), [1, -2, 3, -4].minItem("abs")
  do test.done

testcase["mirror"] = (test)->
  test.expect 1
  test.deepEqual [1, 2, 3, 4, 5].mirror(), [ 1, 2, 3, 4, 5, 4, 3, 2, 1 ]
  do test.done

testcase["mirror1"] = (test)->
  test.expect 1
  test.deepEqual [1, 2, 3, 4, 5].mirror1(), [ 1, 2, 3, 4, 5, 4, 3, 2 ]
  do test.done

testcase["mirror2"] = (test)->
  test.expect 1
  test.deepEqual [1, 2, 3, 4, 5].mirror2(), [ 1, 2, 3, 4, 5, 5, 4, 3, 2, 1 ]
  do test.done

testcase["mod"] = (test)->
  test.expect 1
  a = Array.series(10, -17, 11).mod([-3, 7])
  b = [ -5, 1, 2, 2, 0, 3, 1, 4, 2, 5 ]
  test.deepEqual a, b
  do test.done

testcase["mode"] = (test)->
  test.expect 0
  do test.done

testcase["nearestInList"] = (test)->
  test.expect 1
  list = [0, 0.5, 0.9, 1]
  a = 0.series(0.05, 1).collect (i)-> i.nearestInList list
  b = [ 0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.9, 0.9, 0.9, 0.9, 0.9, 1, 1 ]
  test.deepEqual a, b
  do test.done

testcase["nearestInScale"] = (test)->
  test.expect 0
  do test.done

testcase["neg"] = (test)->
  test.expect 1
  a = Array.series(10, -4, 1.15).neg()
  b = [ 4, 2.85, 1.7, 0.55, -0.6, -1.75, -2.9, -4.05, -5.2, -6.35 ]
  test.ok approximate a, b
  do test.done

testcase["nextPowerOfThree"] = (test)->
  test.expect 1
  a = Array.series(10, -17, 11).nextPowerOfThree()
  b = [ nan, nan, 9, 27, 27, 81, 81, 81, 81, 243 ]
  test.ok approximate a, b
  do test.done

testcase["nextPwoerOf"] = (test)->
  test.expect 1
  a = Array.series(10, -17, 11).nextPowerOf(6)
  b = [ nan, nan, 6, 36, 36, 216, 216, 216, 216, 216 ]
  test.ok approximate a, b
  do test.done

testcase["nextPwoerOfTwo"] = (test)->
  test.expect 1
  a = Array.series(10, -17, 11).nextPowerOfTwo()
  b = [ 1, 1, 8, 16, 32, 64, 64, 64, 128, 128 ]
  test.ok approximate a, b
  do test.done

testcase["normalize"] = (test)->
  test.expect 1
  a = Array.series(10,-4,1.15).normalize()
  b = [ 0, 0.11111111111111, 0.22222222222222, 0.33333333333333, 0.44444444444444, 0.55555555555556, 0.66666666666667, 0.77777777777778, 0.88888888888889, 1 ]
  test.ok approximate a, b
  do test.done

testcase["notEmpty"] = (test)->
  test.expect 2
  test.equal [ ].notEmpty(), false
  test.equal [1].notEmpty(), true
  do test.done

testcase["notEquals"] = (test)->
  test.expect 1
  test.equal [1,2,[3,[4,5]]].notEquals([1,2,[3,[4]]]), true
  do test.done

testcase["numBits"] = (test)->
  test.expect 1
  a = Array.series(10, -17, 11).numBits()
  b = [ 32, 32, 3, 5, 5, 6, 6, 6, 7, 7 ]
  test.deepEqual a, b
  do test.done

testcase["obtain"] = (test)->
  test.expect 0
  do test.done

testcase["occurrencesOf"] = (test)->
  test.expect 2
  test.equal [1, 2, 3, 3, 4, 3, 4, 3].occurrencesOf( 3 ), 4
  test.equal [1, 2, [3], [3], [1], 3].occurrencesOf([3]), 2
  do test.done

testcase["octcps"] = (test)->
  test.expect 1
  a = Array.series(10, -5, 1).octcps()
  b = [ 0.51098743222773, 1.0219748644555, 2.0439497289109, 4.0878994578219, 8.1757989156437, 16.351597831287, 32.703195662575, 65.40639132515, 130.8127826503, 261.6255653006 ]
  test.ok approximate a, b
  do test.done

testcase["odd"] = (test)->
  test.expect 1
  a = Array.series(10, -17, 11).odd()
  b = [ true, false, true, false, true, false, true, false, true, false ]
  test.deepEqual a, b
  do test.done

testcase["opAdd"] = (test)->
  test.expect 2
  test.equal 10.sc("+")(5), 15
  test.deepEqual 10.opAdd([1,2,3]), [11,12,13]
  do test.done

testcase["opDiv"] = (test)->
  test.expect 2
  test.equal 10.sc("/")(5), 2
  test.deepEqual 10.opDiv([1,2,3]), [10,5,10/3]
  do test.done

testcase["opMod"] = (test)->
  test.expect 2
  test.equal 10.sc("%")(3), 1
  test.deepEqual 10.opMod([1,2,3]), [0,0,1]
  do test.done

testcase["opMul"] = (test)->
  test.expect 2
  test.equal 10.sc("*")(5), 50
  test.deepEqual 10.opMul([1,2,3]), [10,20,30]
  do test.done

testcase["opSub"] = (test)->
  test.expect 2
  test.equal 10.sc("-")(5), 5
  test.deepEqual 10.opSub([1,2,3]), [9,8,7]
  do test.done

testcase["pairsDo"] = (test)->
  test.expect 1
  a = []
  [1,2,3,4].pairsDo (i, j)-> a.push i * 10 + j
  test.deepEqual a, [12, 34]
  do test.done

testcase["partition"] = (test)->
  test.expect 0
  do test.done

testcase["performDegreeToKey"] = (test)->
  test.expect 0
  do test.done

testcase["performKeyToDegree"] = (test)->
  test.expect 0
  do test.done

testcase["performNearestInList"] = (test)->
  test.expect 0
  do test.done

testcase["performNearestInScale"] = (test)->
  test.expect 0
  do test.done

testcase["permute"] = (test)->
  test.expect 1
  a = [ 1, 2, 3].permute([0..5])
  b = [ [ 1, 2, 3 ], [ 2, 1, 3 ], [ 3, 2, 1 ], [ 1, 3, 2 ], [ 2, 3, 1 ], [ 3, 1, 2 ] ]
  test.deepEqual a, b
  do test.done

testcase["pow"] = (test)->
  test.expect 2
  test.equal 2.sc("**")(3), 8
  test.deepEqual 2.pow([1,2,3]), [2,4,8]
  do test.done

testcase["previousPowerOf"] = (test)->
  test.expect 1
  a = Array.series(10, 1, 2).previousPowerOf(2)
  b = [ 0.5, 2, 4, 4, 8, 8, 8, 8, 16, 16 ]
  test.deepEqual a, b
  do test.done

testcase["nthPrime"] = (test)->
  test.expect 1
  a = Array.series(10, 1, 2).nthPrime()
  b = [ 3, 7, 13, 19, 29, 37, 43, 53, 61, 71 ]
  test.deepEqual a, b
  do test.done

testcase["prevPrime"] = (test)->
  test.expect 1
  a = Array.series(10, 1, 11).prevPrime()
  b = [ 2, 11, 23, 31, 43, 53, 67, 73, 89, 97 ]
  test.deepEqual a, b
  do test.done

testcase["nextPrime"] = (test)->
  test.expect 1
  a = Array.series(10, 1, 11).nextPrime()
  b = [ 2, 13, 23, 37, 47, 59, 67, 79, 89, 101 ]  
  test.deepEqual a, b
  do test.done

testcase["isPrime"] = (test)->
  test.expect 1
  a = Array.series(10, 1, 11).isPrime()
  b = [ false, false, true, false, false, false, true, false, true, false ]
  test.deepEqual a, b
  do test.done

testcase["indexOfPrime"] = (test)->
  test.expect 1
  a = Array.series(10, 1, 11).indexOfPrime()
  b = [ -1, -1, 8, -1, -1, -1, 18, -1, 23, -1 ]
  test.deepEqual a, b
  do test.done

testcase["product"] = (test)->
  test.expect 2
  test.equal [1,2,3,4].product(), 24
  test.equal [1,2,3,4].product((x)->x*5), 15000
  do test.done

testcase["put"] = (test)->
  test.expect 0
  do test.done

testcase["putEach"] = (test)->
  test.expect 2
  y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  test.deepEqual y.putEach([4, 7], [10, 20]),
    [ 0, 1, 2, 3, 10, 5, 6, 20, 8, 9 ]
  test.deepEqual y.putEach([2, 3, 5, 6], 300),
    [ 0, 1, 300, 300, 10, 300, 300, 20, 8, 9 ]
  do test.done

testcase["putFirst"] = (test)->
  test.expect 2
  test.deepEqual [1,2].putFirst(0), [0,2]
  test.deepEqual [].putFirst(0), []
  do test.done

testcase["putLast"] = (test)->
  test.expect 2
  test.deepEqual [1,2].putLast(0), [1,0]
  test.deepEqual [].putLast(0), []
  do test.done

testcase["pyramid"] = (test)->
  test.expect 9
  a = [ 1, 2, 3, 4, 5 ]
  test.deepEqual a.pyramid(1), [ 1, 1, 2, 1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 4, 5 ]
  test.deepEqual a.pyramid(2), [ 5, 4, 5, 3, 4, 5, 2, 3, 4, 5, 1, 2, 3, 4, 5 ]
  test.deepEqual a.pyramid(3), [ 1, 2, 3, 4, 5, 1, 2, 3, 4, 1, 2, 3, 1, 2, 1 ]
  test.deepEqual a.pyramid(4), [ 1, 2, 3, 4, 5, 2, 3, 4, 5, 3, 4, 5, 4, 5, 5 ]
  test.deepEqual a.pyramid(5), [ 1, 1, 2, 1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 4, 5, 1, 2, 3, 4, 1, 2, 3, 1, 2, 1 ]
  test.deepEqual a.pyramid(6), [ 5, 4, 5, 3, 4, 5, 2, 3, 4, 5, 1, 2, 3, 4, 5, 2, 3, 4, 5, 3, 4, 5, 4, 5, 5 ]
  test.deepEqual a.pyramid(7), [ 1, 2, 3, 4, 5, 1, 2, 3, 4, 1, 2, 3, 1, 2, 1, 1, 2, 1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 4, 5 ]
  test.deepEqual a.pyramid(8), [ 1, 2, 3, 4, 5, 2, 3, 4, 5, 3, 4, 5, 4, 5, 5, 4, 5, 3, 4, 5, 2, 3, 4, 5, 1, 2, 3, 4, 5 ]
  test.deepEqual a.pyramid(9), [ 1, 1, 2, 1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 4, 5, 2, 3, 4, 5, 3, 4, 5, 4, 5, 5 ]
  do test.done

testcase["pyramidg"] = (test)->
  test.expect 9
  a = [ 1, 2, 3, 4, 5 ]
  test.deepEqual a.pyramidg(1), [ [ 1 ], [ 1, 2 ], [ 1, 2, 3 ], [ 1, 2, 3, 4 ], [ 1, 2, 3, 4, 5 ] ]
  test.deepEqual a.pyramidg(2), [ [ 5 ], [ 4, 5 ], [ 3, 4, 5 ], [ 2, 3, 4, 5 ], [ 1, 2, 3, 4, 5 ] ]
  test.deepEqual a.pyramidg(3), [ [ 1, 2, 3, 4, 5 ], [ 1, 2, 3, 4 ], [ 1, 2, 3 ], [ 1, 2 ], [ 1 ] ]
  test.deepEqual a.pyramidg(4), [ [ 1, 2, 3, 4, 5 ], [ 2, 3, 4, 5 ], [ 3, 4, 5 ], [ 4, 5 ], [ 5 ] ]
  test.deepEqual a.pyramidg(5), [ [ 1 ], [ 1, 2 ], [ 1, 2, 3 ], [ 1, 2, 3, 4 ], [ 1, 2, 3, 4, 5 ], [ 1, 2, 3, 4 ], [ 1, 2, 3 ], [ 1, 2 ], [ 1 ] ]
  test.deepEqual a.pyramidg(6), [ [ 5 ], [ 4, 5 ], [ 3, 4, 5 ], [ 2, 3, 4, 5 ], [ 1, 2, 3, 4, 5 ], [ 2, 3, 4, 5 ], [ 3, 4, 5 ], [ 4, 5 ], [ 5 ] ]
  test.deepEqual a.pyramidg(7), [ [ 1, 2, 3, 4, 5 ], [ 1, 2, 3, 4 ], [ 1, 2, 3 ], [ 1, 2 ], [ 1 ], [ 1, 2 ], [ 1, 2, 3 ], [ 1, 2, 3, 4 ], [ 1, 2, 3, 4, 5 ] ]
  test.deepEqual a.pyramidg(8), [ [ 1, 2, 3, 4, 5 ], [ 2, 3, 4, 5 ], [ 3, 4, 5 ], [ 4, 5 ], [ 5 ], [ 4, 5 ], [ 3, 4, 5 ], [ 2, 3, 4, 5 ], [ 1, 2, 3, 4, 5 ] ]
  test.deepEqual a.pyramidg(9), [ [ 1 ], [ 1, 2 ], [ 1, 2, 3 ], [ 1, 2, 3, 4 ], [ 1, 2, 3, 4, 5 ], [ 2, 3, 4, 5 ], [ 3, 4, 5 ], [ 4, 5 ], [ 5 ] ]
  do test.done

testcase["quantize"] = (test)->
  test.expect 0
  do test.done

testcase["raddeg"] = (test)->
  test.expect 1
  a = Array.series(10,-4,1.15).raddeg()
  b = [ -229.18311805233, -163.29297161228, -97.40282517224, -31.512678732195, 34.377467707849, 100.26761414789, 166.15776058794, 232.04790702798, 297.93805346803, 363.82819990807 ]
  test.ok approximate a, b
  do test.done

testcase["ramp"] = (test)->
  test.expect 1
  a = Array.series(10,-4,1.15).ramp()
  b = [ 0, 0, 0, 0, 0.6, 1, 1, 1, 1, 1 ]
  test.ok approximate a, b 
  do test.done

testcase["*rand"] = (test)->
  test.expect 2
  test.equal Array.rand(10).length, 10
  test.ok Array.rand(10000,5,10).every (x)-> 5 <= x < 10
  do test.done

testcase["rand"] = (test)->
  test.expect 0
  do test.done

testcase["*rand2"] = (test)->
  test.expect 2
  test.equal Array.rand2(10).length, 10
  test.ok Array.exprand(10000,5).every (x)-> -5 <= x < 5
  do test.done

testcase["rand2"] = (test)->
  test.expect 0
  do test.done

testcase["ratiomidi"] = (test)->
  test.expect 1
  a = Array.series(10,-4,1.15).ratiomidi()
  b = [ 24, 18.131543031329, 9.1864169563557, -10.349957715001, -8.8435871299945, 9.6882590646912, 18.432634802883, 24.215062895967, 28.542139479045, 32.001079102618 ]
  test.ok approximate a, b
  do test.done

testcase["reciprocal"] = (test)->
  test.expect 1
  a = Array.series(10,-4,1.15).reciprocal()
  b = [ -0.25, -0.35087719298246, -0.58823529411765, -1.8181818181818, 1.6666666666667, 0.57142857142857, 0.3448275862069, 0.24691358024691, 0.19230769230769, 0.15748031496063 ]
  test.ok approximate a, b
  do test.done

testcase["rectWindow"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).rectWindow()
  b = [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 0 ]
  test.deepEqual a, b
  do test.done

testcase["reject"] = (test)->
  test.expect 5
  a = [1,2,3,4].reject (x, i)->
    test.equal x, i + 1
    x & 1
  test.deepEqual a, [2,4]
  do test.done

testcase["remove"] = (test)->
  test.expect 3
  a = [1,2,3,4]
  test.equal a.remove(2), 2
  test.equal a.remove(5), null
  test.deepEqual a, [1,3,4]
  do test.done

testcase["removeAll"] = (test)->
  test.expect 3
  a = [1,2,3,4]
  test.deepEqual a.removeAll([2,5]), [1,3,4]
  test.deepEqual a, [1,3,4]
  test.deepEqual [1, 2, 3, 2, 3, 2, 3, 4].removeAll([2,3]), [ 1, 2, 3, 2, 3, 4 ]
  do test.done

testcase["removeAllSuchThat"] = (test)->
  test.expect 2
  a = [1,2,3,4]
  test.deepEqual a.removeAllSuchThat("even"), [2,4]
  test.deepEqual a, [1,3]
  do test.done

testcase["removeAt"] = (test)->
  test.expect 0
  do test.done

testcase["removeEvery"] = (test)->
  test.expect 3
  a = [1,2,3,4]
  test.deepEqual a.removeEvery([2,5]), [1,3,4]
  test.deepEqual a, [1,3,4]
  test.deepEqual [1, 2, 3, 2, 3, 2, 3, 4].removeEvery([2, 3]), [1, 4]
  do test.done

testcase["removing"] = (test)->
  test.expect 0
  do test.done

testcase["replace"] = (test)->
  test.expect 0
  do test.done

testcase["resamp0"] = (test)->
  test.expect 2
  a = [1, 2, 3, 4].resamp0(12)
  b = [ 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4 ]
  test.deepEqual a, b
  a = [1, 2, 3, 4].resamp0(3)
  b = [1, 3, 4]
  test.deepEqual a, b
  do test.done

testcase["resamp1"] = (test)->
  test.expect 2
  a = [1, 2, 3, 4].resamp1(12)
  b = [ 1, 1.2727272727273, 1.5454545454545, 1.8181818181818, 2.0909090909091, 2.3636363636364, 2.6363636363636, 2.9090909090909, 3.1818181818182, 3.4545454545455, 3.7272727272727, 4 ]
  test.ok approximate a, b
  a = [1, 2, 3, 4].resamp1(3)
  b = [ 1, 2.5, 4 ]
  test.ok approximate a, b
  do test.done

testcase["reverse"] = (test)->
  test.expect 2
  a = Array.series(10,-0.2,0.15)
  b = a.sc_reverse()
  c = [ 1.15, 1, 0.85, 0.7, 0.55, 0.4, 0.25, 0.1, -0.05, -0.2 ]
  test.notEqual a, b
  test.ok approximate b, c
  do test.done

testcase["reverseDo"] = (test)->
  test.expect 0
  do test.done

testcase["rightShift"] = (test)->
  test.expect 2
  test.equal 12.rightShift(2), 3
  test.deepEqual 12.rightShift([2]), [3]
  do test.done

testcase["ring1"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).ring1(2)
  b = [ -0.6, -0.15, 0.3, 0.75, 1.2, 1.65, 2.1, 2.55, 3, 3.45 ]
  test.ok approximate a, b
  do test.done

testcase["ring2"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).ring2(2)
  b = [ 1.4, 1.85, 2.3, 2.75, 3.2, 3.65, 4.1, 4.55, 5, 5.45 ]  
  test.ok approximate a, b
  do test.done

testcase["ring3"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).ring3(2)
  b = [ 0.08, 0.005, 0.02, 0.125, 0.32, 0.605, 0.98, 1.445, 2, 2.645 ]
  test.ok approximate a, b
  do test.done

testcase["ring4"] = (test)->
  test.expect 0
  # a = Array.series(10,-0.2,0.15).ring4(2)
  # b = [ 0.08, 0.005, 0.02, 0.125, 0.32, 0.605, 0.98, 1.445, 2, 2.645 ]
  # test.ok approximate a, b
  do test.done

testcase["rotate"] = (test)->
  test.expect 1
  a = Array.series(10,-17,11).rotate(3)
  b = [ 60, 71, 82, -17, -6, 5, 16, 27, 38, 49 ]
  test.deepEqual a, b
  do test.done

testcase["round"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).round(0.12)
  b = [ -0.24, 0, 0.12, 0.24, 0.36, 0.6, 0.72, 0.84, 0.96, 1.2 ]
  test.ok approximate a, b
  do test.done

testcase["roundUp"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).roundUp(0.12)
  b = [ -0.12, -0, 0.12, 0.36, 0.48, 0.6, 0.72, 0.96, 1.08, 1.2 ]
  test.ok approximate a, b
  do test.done

testcase["rrand"] = (test)->
  test.expect 0
  do test.done

testcase["scaleneg"] = (test)->
  test.expect 0
  do test.done

testcase["scramble"] = (test)->
  test.expect 0
  do test.done

testcase["scurve"] = (test)->
  test.expect 0
  do test.done

testcase["sect"] = (test)->
  test.expect 1
  test.deepEqual [1, 2, 3].sect([2, 3, 4, 5]), [2, 3]
  do test.done

testcase["select"] = (test)->
  test.expect 5
  a = [1,2,3,4].select (x, i)->
    test.equal x, i + 1
    x & 1
  test.deepEqual a, [1,3]
  do test.done

testcase["separate"] = (test)->
  test.expect 2
  a = [1, 2, 3, 5, 6, 8, 10].separate()
  b = [ [ 1 ], [ 2 ], [ 3 ], [ 5 ], [ 6 ], [ 8 ], [ 10 ] ]
  test.deepEqual a, b
  a = [1, 2, 3, 5, 6, 8, 10].separate (a, b) -> (b - a) > 1
  b = [ [ 1, 2, 3 ], [ 5, 6 ], [ 8 ], [ 10 ] ]
  test.deepEqual a, b
  do test.done

testcase["*series"] = (test)->
  test.expect 1
  a = Array.series(10, -10, 2)
  b = [ -10, -8, -6, -4, -2, 0, 2, 4, 6, 8 ]
  test.deepEqual a, b
  do test.done

testcase["series"] = (test)->
  test.expect 0
  do test.done

testcase["setBit"] = (test)->
  test.expect 0
  do test.done

testcase["sign"] = (test)->
  test.expect 1
  a = Array.series(10,-12,3).sign()
  b = [ -1, -1, -1, -1, 0, 1, 1, 1, 1, 1 ]
  test.deepEqual a, b
  do test.done

testcase["sin"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).sin()
  b = [ -0.19866933079506, -0.049979169270678, 0.099833416646828, 0.24740395925452, 0.38941834230865, 0.52268722893066, 0.64421768723769, 0.75128040514029, 0.8414709848079, 0.91276394026052 ]
  test.ok approximate a, b
  do test.done

testcase["sinh"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).sinh()
  b = [ -0.20133600254109, -0.050020835937655, 0.10016675001984, 0.25261231680817, 0.41075232580282, 0.57815160374345, 0.75858370183953, 0.95611595998863, 1.1752011936438, 1.4207780701554 ]
  test.ok approximate a, b
  do test.done

testcase["size"] = (test)->
  test.expect 1
  test.equal [1,2,3,4,5].size(), 5
  do test.done

testcase["slide"] = (test)->
  test.expect 1
  a = [1, 2, 3, 4, 5, 6].slide(3, 1)
  b = [ 1, 2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6 ]
  test.deepEqual a, b
  do test.done

testcase["softclip"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).softclip()
  b = [ -0.2, -0.05, 0.1, 0.25, 0.4, 0.54545454545455, 0.64285714285714, 0.70588235294118, 0.75, 0.78260869565217 ]
  test.ok approximate a, b
  do test.done

testcase["sputter"] = (test)->
  test.expect 0
  do test.done

testcase["sqrdif"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).sqrdif(2)
  b = [ 4.84, 4.2025, 3.61, 3.0625, 2.56, 2.1025, 1.69, 1.3225, 1, 0.7225 ]
  test.ok approximate a, b
  do test.done

testcase["sqrsum"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).sqrsum([2,3])
  b = [ 3.24, 8.7025, 4.41, 10.5625, 5.76, 12.6025, 7.29, 14.8225, 9, 17.2225 ]
  test.ok approximate a, b
  do test.done

testcase["sqrt"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).sqrt()
  b = [ nan, nan, 0.31622776601684, 0.5, 0.63245553203368, 0.74161984870957, 0.83666002653408, 0.92195444572929, 1, 1.0723805294764 ]
  test.ok approximate a, b
  do test.done

testcase["squared"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).squared()
  b = [ 0.04, 0.0025, 0.01, 0.0625, 0.16, 0.3025, 0.49, 0.7225, 1, 1.3225 ]
  test.ok approximate a, b
  do test.done

testcase["stutter"] = (test)->
  test.expect 1
  a = [1, 2, 3].stutter(3)
  b = [ 1, 1, 1, 2, 2, 2, 3, 3, 3 ]
  test.deepEqual a, b
  do test.done

testcase["sum"] = (test)->
  test.expect 2
  test.equal [1, 2, 3, 4].sum(), 10
  test.equal [1, 2, 3, 4].sum("squared"), 30
  do test.done

testcase["sum3rand"] = (test)->
  test.expect 0
  do test.done

testcase["sumabs"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).sumabs()
  b = 5.25
  test.equal a, b
  do test.done

testcase["sumsqr"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).sumsqr([2,3])
  b = [ 4.04, 9.0025, 4.01, 9.0625, 4.16, 9.3025, 4.49, 9.7225, 5, 10.3225 ]
  test.ok approximate a, b
  do test.done

testcase["swap"] = (test)->
  test.expect 0
  do test.done

testcase["symmetricDifference"] = (test)->
  test.expect 1
  test.deepEqual [1, 2, 3].symmetricDifference([2, 3, 4, 5]), [ 1, 4, 5 ]
  do test.done

testcase["take"] = (test)->
  test.expect 2
  a = [11, 12, 13, 14, 15]
  test.equal a.take(12), 12
  test.deepEqual a, [11, 15, 13, 14]
  do test.done

testcase["takeAt"] = (test)->
  test.expect 0
  do test.done

testcase["takeThese"] = (test)->
  test.expect 0
  do test.done

testcase["tan"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).tan()
  b = [ -0.20271003550867, -0.050041708375539, 0.10033467208545, 0.25534192122104, 0.42279321873816, 0.61310521328814, 0.84228838046308, 1.1383327132284, 1.5574077246549, 2.2344969487553 ]
  test.ok approximate a, b
  do test.done

testcase["tanh"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).tanh()
  b = [ -0.1973753202249, -0.04995837495788, 0.099667994624956, 0.24491866240371, 0.37994896225522, 0.50052021119024, 0.60436777711716, 0.69106946983293, 0.76159415595576, 0.81775407797029 ]  
  test.ok approximate a, b
  do test.done

testcase["thresh"] = (test)->
  test.expect 0
  do test.done

testcase["transposeKey"] = (test)->
  test.expect 0
  do test.done

testcase["triWindow"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).triWindow()
  b = [ 0, 0, 0.2, 0.5, 0.8, 0.9, 0.6, 0.3, 0, 0 ]
  test.ok approximate a, b
  do test.done

testcase["trunc"] = (test)->
  test.expect 2
  test.equal 12345.trunc(26), 12324
  test.deepEqual 12345.trunc([26]), [12324]
  do test.done

testcase["twice"] = (test)->
  test.expect 1
  test.equal 3.twice(), 6
  do test.done

testcase["unbubble"] = (test)->
  test.expect 1
  a = [[10]].unbubble(1, 3)
  b = [ 10 ]
  test.deepEqual a, b
  do test.done

testcase["union"] = (test)->
  test.expect 1
  test.deepEqual [1, 2, 3].union([2, 3, 4, 5]), [1, 2, 3, 4, 5]
  do test.done

testcase["uniq"] = (test)->
  test.expect 1
  a = [1,2,3,3,2,0].uniq()
  b = [1,2,3,0]
  test.deepEqual a, b
  do test.done

testcase["unsignedRightShift"] = (test)->
  test.expect 2
  test.equal 12.unsignedRightShift(2), 3
  test.deepEqual 12.unsignedRightShift([2]), [3]
  do test.done

testcase["value"] = (test)->
  test.expect 3
  a = 10.value()
  b = 10
  test.equal a, b
  a = [10].value()
  b = [10]
  test.deepEqual a, b
  a = ((x)->x*10).value(5)
  b = 50
  test.equal a, b
  do test.done

testcase["valueArray"] = (test)->
  test.expect 3
  a = 10.valueArray()
  b = 10
  test.equal a, b
  a = [10].valueArray()
  b = [10]
  test.deepEqual a, b
  a = ((x,y)->x*10+y*100).valueArray([5, 1])
  b = 150
  test.equal a, b
  do test.done

testcase["wchoose"] = (test)->
  test.expect 1
  a = [1,2,3]
  test.ok [0...10000].every -> a.indexOf(a.wchoose([0.2,0.3,0.5])) != -1
  do test.done

testcase["welWindow"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).welWindow()
  b = [ 0, 0, 0.30901699437495, 0.70710678118655, 0.95105651629515, 0.98768834059514, 0.80901699437495, 0.45399049973955, 1.2246467991474e-16, 0 ]
  test.ok approximate a, b
  do test.done

testcase["*with"] = (test)->
  test.expect 1
  test.deepEqual Array.with(0,1,2,3), [ 0, 1, 2, 3 ]
  do test.done

testcase["wrap"] = (test)->
  test.expect 1
  a = Array.series(10,-0.2,0.15).wrap(-1.2, 2.5)
  b = [ -0.2, -0.05, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1, 1.15 ]
  test.ok approximate a, b
  do test.done

testcase["wrap2"] = (test)->
  test.expect 1
  a = Array.series(10, -2, 0.4).wrap2(0.3)
  b = [ -0.2, 0.2, 0, -0.2, 0.2, 0, -0.2, 0.2, 2.2204460492503e-16, -0.2 ]
  test.ok approximate a, b
  do test.done

testcase["wrapAt"] = (test)->
  test.expect 3
  test.equal [3, 4, 5].wrapAt(6), 3
  test.equal [3, 4, 5].wrapAt(-1), 5
  test.deepEqual [3, 4, 5].wrapAt([6, 8]), [3, 5]
  do test.done

testcase["wrapExtend"] = (test)->
  test.expect 1
  test.deepEqual [-2,-1,0,1,2].wrapExtend(10), [ -2, -1, 0, 1, 2, -2, -1, 0, 1, 2 ]
  do test.done

testcase["wrapPut"] = (test)->
  test.expect 1
  test.deepEqual [1,2,3,4].wrapPut(5, 10), [ 1, 10, 3, 4 ]
  do test.done

testcase["wrapSwap"] = (test)->
  test.expect 0
  do test.done

testcase["xrand"] = (test)->
  test.expect 0
  do test.done

testcase["xrand2"] = (test)->
  test.expect 0
  do test.done

module.exports = require("nodeunit").testCase testcase
