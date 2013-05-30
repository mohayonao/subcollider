require "../builds/subcollider.js"

testcase = {}

testcase["Pser"] = (test)->
  test.expect 10
  p = sc.Pser([1,2,3], 8, 2)
  test.equal p.next(), 3
  test.equal p.next(), 1
  test.equal p.next(), 2
  test.equal p.next(), 3
  test.equal p.next(), 1
  test.equal p.next(), 2
  test.equal p.next(), 3
  test.equal p.next(), 1
  test.equal p.next(), null
  test.equal p.next(), null
  do test.done

testcase["Pseq"] = (test)->
  test.expect 10
  p = sc.Pseq([1,2,3], 2, 2)
  test.equal p.next(), 3
  test.equal p.next(), 1
  test.equal p.next(), 2
  test.equal p.next(), 3
  test.equal p.next(), 1
  test.equal p.next(), 2
  test.equal p.next(), null
  test.equal p.next(), null
  test.equal p.next(), null
  test.equal p.next(), null
  do test.done

testcase["Pshuf"] = (test)->
  test.expect 10
  p = sc.Pshuf([1,2,3], 8)
  l = p.list  
  test.equal p.next(), l[0]
  test.equal p.next(), l[1]
  test.equal p.next(), l[2]
  test.equal p.next(), l[0]
  test.equal p.next(), l[1]
  test.equal p.next(), l[2]
  test.equal p.next(), l[0]
  test.equal p.next(), l[1]
  test.equal p.next(), null
  test.equal p.next(), null
  do test.done

testcase["Prand"] = (test)->
  test.expect 10
  p = sc.Prand([1,2,3], 8)
  l = p.list
  test.notEqual l.indexOf(p.next()), -1
  test.notEqual l.indexOf(p.next()), -1
  test.notEqual l.indexOf(p.next()), -1
  test.notEqual l.indexOf(p.next()), -1
  test.notEqual l.indexOf(p.next()), -1
  test.notEqual l.indexOf(p.next()), -1
  test.notEqual l.indexOf(p.next()), -1
  test.notEqual l.indexOf(p.next()), -1
  test.equal l.indexOf(p.next()), -1
  test.equal l.indexOf(p.next()), -1
  do test.done

testcase["Pseries"] = (test)->
  test.expect 10
  p = sc.Pseries(3, 2, 8)
  test.equal p.next(), 3
  test.equal p.next(), 5
  test.equal p.next(), 7
  test.equal p.next(), 9
  test.equal p.next(), 11
  test.equal p.next(), 13
  test.equal p.next(), 15
  test.equal p.next(), 17
  test.equal p.next(), null
  test.equal p.next(), null
  do test.done

testcase["Pgeom"] = (test)->
  test.expect 10
  p = sc.Pgeom(3, 2, 8)
  test.equal p.next(), 3
  test.equal p.next(), 6
  test.equal p.next(), 12
  test.equal p.next(), 24
  test.equal p.next(), 48
  test.equal p.next(), 96
  test.equal p.next(), 192
  test.equal p.next(), 384
  test.equal p.next(), null
  test.equal p.next(), null
  do test.done
      
module.exports = require("nodeunit").testCase testcase
