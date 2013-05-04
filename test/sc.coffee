require "../build/subcollider.js"

testcase = {}

testcase["sc"] = (test)->
  test.expect 1
  test.ok !!sc
  do test.done

module.exports = require("nodeunit").testCase testcase
