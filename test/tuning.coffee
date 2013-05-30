require "../builds/subcollider.js"

testcase = {}

testcase["new"] = (test)->
  test.expect 1
  test.ok sc.Tuning() instanceof sc.Tuning
  do test.done

testcase["et12"] = (test)->
  test.expect 1
  test.ok sc.Tuning.et12().equals sc.TuningInfo.at("et12")
  do test.done

testcase["just"] = (test)->
  test.expect 1
  test.ok sc.Tuning.just().equals sc.TuningInfo.at("just")
  do test.done

testcase["octaveRatio"] = (test)->
  test.expect 1
  test.equal sc.Tuning.just().octaveRatio(), 2
  do test.done

testcase["stepsPerOctave"] = (test)->
  test.expect 1
  test.equal sc.Tuning.just().stepsPerOctave(), 12
  do test.done

testcase["size"] = (test)->
  test.expect 1
  test.equal sc.Tuning.just().size(), 12
  do test.done

testcase["tuning"] = (test)->
  test.expect 1
  test.deepEqual sc.Tuning.just().tuning(), sc.Tuning.just()._tuning
  do test.done

testcase["semitones"] = (test)->
  test.expect 1
  test.deepEqual sc.Tuning.just().semitones(), sc.Tuning.just().tuning()
  do test.done

testcase["cents"] = (test)->
  test.expect 1
  test.deepEqual sc.Tuning.just().cents(), sc.Tuning.just().tuning().map (x)->x*100
  do test.done

testcase["at"] = (test)->
  test.expect 3
  t = sc.Tuning.just()
  test.equal t.at(0), 0
  test.equal t.at(1), 1.1173128526977776
  test.deepEqual t.at([2,3,4,5,6,7,8,9,10,11,12]), [2.0391000173077485, 3.1564128700055254, 3.863137138648348, 4.980449991346124, 5.9022371559560955, 7.019550008653875, 8.136862861351652, 8.843587129994475, 10.175962878659401, 10.88268714730222, undefined]
  do test.done  

testcase["wrapA"] = (test)->
  test.expect 3
  t = sc.Tuning.just()
  test.equal t.wrapAt(0), 0
  test.equal t.wrapAt(1), 1.1173128526977776
  test.deepEqual t.wrapAt([2,3,4,5,6,7,8,9,10,11,12]), [2.0391000173077485, 3.1564128700055254, 3.863137138648348, 4.980449991346124, 5.9022371559560955, 7.019550008653875, 8.136862861351652, 8.843587129994475, 10.175962878659401, 10.88268714730222, 0]
  do test.done  

module.exports = require("nodeunit").testCase testcase
