require "../builds/subcollider.js"

testcase = {}

testcase["new"] = (test)->
  test.expect 1
  test.ok sc.Scale() instanceof sc.Scale
  do test.done

testcase["major"] = (test)->
  test.expect 1
  test.ok sc.Scale.major().equals sc.ScaleInfo.at("major")
  do test.done

testcase["minor"] = (test)->
  test.expect 1
  test.ok sc.Scale.minor().equals sc.ScaleInfo.at("minor")
  do test.done

testcase["size"] = (test)->
  test.expect 1
  test.equal sc.Scale.major().size(), 7
  do test.done

testcase["pitchesPerOctave"] = (test)->
  test.expect 1
  test.equal sc.Scale.major().pitchesPerOctave(), 12
  do test.done

testcase["stepsPerOctave"] = (test)->
  test.expect 1
  test.equal sc.Scale.major().stepsPerOctave(), 12
  do test.done

testcase["get tuning()"] = (test)->
  test.expect 1
  test.ok sc.Scale.major().tuning() instanceof sc.Tuning
  do test.done

testcase["set tuning()"] = (test)->
  test.expect 2
  s = sc.Scale.major()
  test.ok not (s.tuning().equals(sc.Tuning.just()))
  s.tuning(sc.Tuning.just())
  test.ok s.tuning().equals(sc.Tuning.just())
  do test.done

testcase["semitones"] = (test)->
  test.expect 2
  test.deepEqual sc.Scale.major().semitones(), [0,2,4,5,7,9,11]
  test.deepEqual sc.Scale.minor().semitones(), [0,2,3,5,7,8,10]
  do test.done

testcase["cents"] = (test)->
  test.expect 2
  test.deepEqual sc.Scale.major().cents(), [0,200,400,500,700,900,1100]
  test.deepEqual sc.Scale.minor().cents(), [0,200,300,500,700,800,1000]
  do test.done

testcase["ratios"] = (test)->
  test.expect 1
  test.deepEqual sc.Scale.major().ratios(), [1, 1.122462048309373, 1.2599210498948732, 1.3348398541700344, 1.4983070768766815, 1.681792830507429, 1.8877486253633868]
  do test.done

testcase["at"] = (test)->
  test.expect 3
  s = sc.Scale.major();
  test.equal s.at(0), 0
  test.equal s.at(1), 2
  test.deepEqual s.at([2,3,4,5,6,7,8]), [4,5,7,9,11,0,2]
  do test.done

testcase["wrapA"] = (test)->
  test.expect 3
  s = sc.Scale.major();
  test.equal s.wrapAt(0), 0
  test.equal s.wrapAt(1), 2
  test.deepEqual s.wrapAt([2,3,4,5,6,7,8]), [4,5,7,9,11,0,2]
  do test.done

testcase["degreeToFreq"] = (test)->
  test.expect 5
  s = sc.Scale.major();
  test.equal s.degreeToFreq(0, 440), 440
  test.equal s.degreeToFreq(1, 440), 493.8833012561241
  test.deepEqual s.degreeToFreq([2,3,4,5,6,7,8], 440), [554.3652619537442, 587.3295358348151, 659.2551138257398, 739.9888454232688, 830.6093951598903, 880, 987.7666025122483]
  test.equal s.degreeToFreq(1, 440,  1), 987.7666025122483
  test.equal s.degreeToFreq(1, 440, -1), 246.94165062806206
  do test.done

testcase["degreeToRatio"] = (test)->
  test.expect 5
  s = sc.Scale.major();
  test.equal s.degreeToRatio(0), 1
  test.equal s.degreeToRatio(1), 1.122462048309373
  test.deepEqual s.degreeToRatio([2,3,4,5,6,7,8]), [1.2599210498948732, 1.3348398541700344, 1.4983070768766815, 1.681792830507429, 1.8877486253633868, 2, 2.244924096618746]
  test.equal s.degreeToRatio(1, 1), 2.244924096618746
  test.equal s.degreeToRatio(1, -1), 0.5612310241546865
  do test.done

testcase["performDegreeToKey"] = (test)->
  test.expect 5
  s = sc.Scale.major()
  test.equal s.performDegreeToKey(0), 0
  test.equal s.performDegreeToKey(1), 2
  test.deepEqual s.performDegreeToKey([2,3,4,5,6,7,8]), [4,5,7,9,11,12,14]
  test.equal s.performDegreeToKey(8, 1), 3
  test.equal s.performDegreeToKey(8, 1, 5), 3.4166666666666665
  do test.done

testcase["performKeyToDegree"] = (test)->
  test.expect 3
  s = sc.Scale.major()
  test.equal s.performKeyToDegree(0), 0
  test.equal s.performKeyToDegree(1), 0.5
  test.deepEqual s.performKeyToDegree([2,3,4,5,6,7,8,9,10,11,12]), [1,1.5,2,3,3.5,4,4.5,5,5.5,6,7]
  do test.done  

module.exports = require("nodeunit").testCase testcase
