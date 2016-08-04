var should = require('chai').should()
var _ = require("underscore")
var Predictor = require('../src').naiveBayes.Predictor

describe("Naive Bayes Predictor", function() {

    beforeEach(function* () {
        global.predictor = Predictor()
    })

    it("should predict single class", function* () {
        predictor.learn([1, 0], 1)
        predictor.predict([1, 0]).should.eql(1)
    })

    it("should predict from two classes", function* () {
        predictor.learn([1, 0], 1)
        predictor.learn([0, 1], 2)
        predictor.learn([0, 1], 1)
        predictor.predict([1, 0]).should.eql(1)
    })

})
