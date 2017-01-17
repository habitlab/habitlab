var should = require('chai').should()
var _ = require("underscore")
var totalRegret = require('../src').metrics.totalRegret

describe("Metrics", function() {

    it("should compute total regret", function* () {
        probabilities = [0.4, 0.8]
        choices = [0, 0]
        totalRegret(probabilities, choices).should.eql([.4, .8])
    })

})
