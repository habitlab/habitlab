var should = require('chai').should()
var Stats = require('../src').stats

describe("Stats", function() {

    beforeEach(function* () {
        global.dataSet = [-2, 4, 6, 4]
    })

    it("should compute sum", function*() {
        Stats.sum(dataSet).should.eql(12)
    })

    it("should compute mean", function*() {
        Stats.mean(dataSet).should.eql(3)
    })

    it("should compute min", function*() {
        Stats.min(dataSet).should.eql(-2)
    })

    it("should compute max", function*() {
        Stats.max(dataSet).should.eql(6)
    })

    it("should compute variance", function*() {
        Stats.variance(dataSet).should.eql(9)
    })
})
